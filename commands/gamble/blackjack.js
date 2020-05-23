const Eco = require('quick.eco');
const eco = new Eco.Manager();
const {getcardvalue, randomcard, checkautowin, createembed, laysodep, createembedfield} = require('../../functions.js');
const hitemoji = "👊";
const stopemoji = "🛑"
const ms = require('ms');
const cooldown = new Set();
module.exports = {
    name: 'blackjack',
    category: 'gamble',
    aliases: ['bj'],
    description: 'Chơi blackjack (xì dách)',
    note: 'Trên 21 điểm là thua :)',
    usage: 'backjack <tiền cược>',
    VD: 'bj 10000',
    run: async (client, message, args) => {
        if (cooldown.has(message.author.id)) return message.channel.send('Bạn phải chờ 10 giây sau khi chơi xong để chơi tiếp.')
        let player_deck = [];
        let bots_deck = [];
        let maxbet = 5000000;
        let backcard = '<:back:709983842542288899>'
        let hide_deck = []
        let listofcard = require('../../data/cardemojis.json').fulllist
        //check bet
        let userdata = eco.fetchMoney(message.author.id);
        let bet = undefined;
        if (args[0] == 'all') bet = 100000;
        else if (isNaN(args[0])) return message.channel.send('Vui lòng nhập tiền cược!');
        else if (args[0] <= userdata.amount && args[0] < maxbet) bet = args[0]
        else if (args[0] <= userdata.amount && args[0] > maxbet) bet = maxbet
        else return message.channel.send('Bạn không đủ tiền cược!')
        //2 card each
        for (let i = 0; i < 2; i++){
            player_deck.push(await randomcard(listofcard))
            listofcard.filter(e => e !== player_deck)
            bots_deck.push(await randomcard(listofcard))
            listofcard.filter(e => e !== player_deck)
            hide_deck.push(backcard)
        }
        //max bet phải sửa lại
        let embed = createembed(message.author, laysodep(bet), createembedfield(player_deck), createembedfield(bots_deck), getcardvalue(player_deck), getcardvalue(bots_deck), createembedfield(hide_deck), "not")
        let msg = await message.channel.send(embed)
        //check coi có xi dach hoac xi bang
        let player_first = checkautowin(player_deck)
        if (player_first.check == true) {
            if (player_first.loaiwin == 'xidach'){
                //cong tien thuong
                await eco.addMoney(message.author.id, bet)
                return await msg.edit(createembed(message.author, laysodep(bet), createembedfield(player_deck), createembedfield(bots_deck), getcardvalue(player_deck), getcardvalue(bots_deck), createembedfield(hide_deck), "thang"))
            } else if (player_first.loaiwin == 'xibang'){
                //x2 tien thuong
                await eco.addMoney(message.author.id, bet*2)
                return await msg.edit(createembed(message.author, laysodep(bet), createembedfield(player_deck), createembedfield(bots_deck), getcardvalue(player_deck), getcardvalue(bots_deck), createembedfield(hide_deck), "thangx2"))
            }
        } else if (checkautowin(bots_deck).check == true) {
                await eco.removeMoney(message.author.id, bet)
                return await msg.edit(createembed(message.author, laysodep(bet), createembedfield(player_deck), createembedfield(bots_deck), getcardvalue(player_deck), getcardvalue(bots_deck), createembedfield(hide_deck), "thua"))
        }
        //tính điểm
        msg.react(hitemoji);
        msg.react(stopemoji);
        cooldown.add(message.author.id)
        const filter = (reaction, user) => {
            return (reaction.emoji.name === hitemoji || reaction.emoji.name === stopemoji) && user.id === message.author.id
        }
        let collector = msg.createReactionCollector(filter, {time: ms('1m')}) 
        collector.on('collect',async (reaction, user) => {
            if (reaction.emoji.name === hitemoji){
                player_deck.push(await randomcard(listofcard))
                listofcard.filter(e => e !== player_deck)
                if (getcardvalue(player_deck) > 21 || parseInt(getcardvalue(player_deck).replace('*', '')) > 21){
                    collector.stop()
                    return await userautobust(message.author, bots_deck, player_deck, msg, bet)
                }
                await msg.edit(createembed(message.author, laysodep(bet), createembedfield(player_deck), createembedfield(bots_deck), getcardvalue(player_deck), getcardvalue(bots_deck), createembedfield(hide_deck), "not"))
            } else if (reaction.emoji.name === stopemoji){
                await stop(message.author, listofcard, bots_deck, player_deck, msg, bet)
            }
        })
        collector.on('end', async (collected, reason) => {
            if (reason == 'time') msg.edit('Trò chơi hết hạn.')
            setTimeout(() => {
                cooldown.delete(message.author.id)
            }, ms('10s'))
        })
        setTimeout(() => {
            cooldown.delete(message.author.id)
        }, ms('10s'))
    }
}

async function stop(player, listofcard, bots_deck, player_deck, msg, bet){
    while (getcardvalue(bots_deck) < 15 || parseInt(getcardvalue(bots_deck).replace('*', '')) < 15){
        bots_deck.push(await randomcard(listofcard))
        listofcard.filter(e => e !== player_deck)
    }
    let kind_of_winning = undefined
    let bot_points = getcardvalue(bots_deck) 
    let user_points = getcardvalue(player_deck)
    if (isNaN(bot_points)) bot_points = parseInt(bot_points.replace('*', ''))
    if (isNaN(user_points)) user_points = parseInt(user_points.replace('*', ''))
    if (user_points > 21 && bot_points > 21){
        kind_of_winning = 'hoa'
    } else if (user_points == bot_points){
        kind_of_winning = 'hoa'
    } else if (user_points > 21){
        kind_of_winning = 'thua'
        await money(player.id, 'lose', bet)
    } else if (bot_points > 21){
        kind_of_winning = 'thang'
        await money(player.id, 'win', bet)
    } else if (user_points > bot_points){
        kind_of_winning = 'thang'
        await money(player.id, 'win', bet)
    } else {
        kind_of_winning = 'thua'
        await money(player.id, 'lose', bet)
    }
    return await msg.edit(createembed(player, laysodep(bet), createembedfield(player_deck), createembedfield(bots_deck), getcardvalue(player_deck), getcardvalue(bots_deck), null, kind_of_winning))
}

async function userautobust(player, bots_deck, player_deck, msg, bet){
    let kind_of_winning = "thua";
    await money(player.id, 'lose', bet)
    return await msg.edit(createembed(player, laysodep(bet), createembedfield(player_deck), createembedfield(bots_deck), getcardvalue(player_deck), getcardvalue(bots_deck), null, kind_of_winning))
}

async function money(userid, kind ,ammount){
    if (!userid || !ammount) return null;
    if (kind == 'win'){
        await eco.addMoney(userid, ammount)
    } else {
        await eco.removeMoney(userid, ammount)
    }
}