const Eco = require('quick.eco');
const eco = new Eco.Manager();
const {getcardvalue, randomcard, checkautowin, createembed, laysodep, createembedfield, locbai} = require('../../functions/utils');
const check_game = new Set();
const hitemoji = "👊";
const stopemoji = "🛑"
const ms = require('ms')
module.exports = {
    name: 'blackjack',
    category: 'gamble',
    cooldown: 10,
    aliases: ['bj'],
    description: 'Chơi blackjack (xì dách)',
    note: 'Trên 21 điểm là thua :)',
    usage: 'backjack <tiền cược>',
    example: 'bj 10000',
    run: async (client, message, args) => {
        if (check_game.has(message.author.id)) return message.channel.send('Bạn chưa hoàn thành ván đấu, vui lòng hoàn thành ván chơi!')
        let player_deck = [];
        let bots_deck = [];
        let maxbet = 500000;
        let backcard = '<:back:709983842542288899>'
        let hide_deck = []
        let listofcard = require('../../assets/cardemojis.json').fulllist
        //check bet
        let userdata = eco.fetchMoney(message.author.id);
        let bet = undefined;
        if (args[0] == 0) return message.channel.send('Bạn không thể cược 0.')
        if (args[0] == 'all') {
            bet = 100000;
            if (bet > userdata.amount) bet = userdata.amount
        }
        else if (isNaN(args[0])) return message.channel.send('Vui lòng nhập tiền cược!');
        else bet = args[0]
        if (bet > parseInt(userdata.amount) || userdata.amount == 0) return message.channel.send('Bạn không có đủ tiền để chơi!');
        else if (bet > maxbet) bet = maxbet
        check_game.add(message.author.id)
        //2 card each
        for (let i = 0; i < 2; i++){
            player_deck.push(await randomcard(listofcard))
            listofcard = locbai(listofcard, player_deck)
            bots_deck.push(await randomcard(listofcard))
            listofcard = locbai(listofcard, bots_deck)
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
                check_game.delete(message.author.id)
                return await msg.edit(createembed(message.author, laysodep(bet), createembedfield(player_deck), createembedfield(bots_deck), getcardvalue(player_deck), getcardvalue(bots_deck), createembedfield(hide_deck), "thang"))
            } else if (player_first.loaiwin == 'xibang'){
                //x2 tien thuong
                await eco.addMoney(message.author.id, bet*2)
                check_game.delete(message.author.id)
                return await msg.edit(createembed(message.author, laysodep(bet), createembedfield(player_deck), createembedfield(bots_deck), getcardvalue(player_deck), getcardvalue(bots_deck), createembedfield(hide_deck), "thangx2"))
            }
        } else if (checkautowin(bots_deck).check == true) {
                await eco.removeMoney(message.author.id, bet)
                check_game.delete(message.author.id)
                return await msg.edit(createembed(message.author, laysodep(bet), createembedfield(player_deck), createembedfield(bots_deck), getcardvalue(player_deck), getcardvalue(bots_deck), createembedfield(hide_deck), "thua"))
        }
        //tính điểm
        msg.react(hitemoji);
        msg.react(stopemoji);
        const filter = (reaction, user) => {
            return (reaction.emoji.name === hitemoji || reaction.emoji.name === stopemoji) && user.id === message.author.id
        }
        let collector = msg.createReactionCollector(filter, {time: ms('1m')}) 
        collector.on('collect',async (reaction, user) => {
            if (reaction.emoji.name === hitemoji){
                player_deck.push(await randomcard(listofcard))
                listofcard = locbai(listofcard, player_deck)
                if (getcardvalue(player_deck) > 21 || parseInt(getcardvalue(player_deck).replace('*', '')) > 21){
                    collector.stop()
                    return await stop(message.author, listofcard, bots_deck, player_deck, msg, bet, check_game)
                }
                await msg.edit(createembed(message.author, laysodep(bet), createembedfield(player_deck), createembedfield(bots_deck), getcardvalue(player_deck), getcardvalue(bots_deck), createembedfield(hide_deck), "not"))
            } else if (reaction.emoji.name === stopemoji){
                collector.stop()
                await stop(message.author, listofcard, bots_deck, player_deck, msg, bet, check_game)
            }
        })
        collector.on('end', async (collected, reason) => {
            if (reason == 'time') {
                msg.edit('Trò chơi hết hạn. Bạn sẽ bị trừ tiền.')
                money(message.author.id, "thua", bet)
            }
            check_game.delete(message.author.id)
        })
    }
}

async function stop(player, listofcard, bots_deck, player_deck, msg, bet, check_game){
    check_game.delete(player.id)
    while (getcardvalue(bots_deck) < 15 || parseInt(getcardvalue(bots_deck).replace('*', '')) < 15){
        bots_deck.push(await randomcard(listofcard))
        listofcard = locbai(listofcard, bots_deck)
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

async function money(userid, kind ,ammount){
    if (!userid || !ammount) return null;
    if (kind == 'win'){
        await eco.addMoney(userid, ammount)
    } else {
        await eco.removeMoney(userid, ammount)
    }
}
