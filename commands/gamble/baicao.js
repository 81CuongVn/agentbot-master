const Eco = require('quick.eco');
const eco = new Eco.Manager();
const {randomcard, createembedfield, laysodep} = require('../../functions');
const cooldown = new Set();
const ms = require('ms');
module.exports = {
    name: 'baicao',
    aliases: ['bc'],
    description: 'bài cào',
    category: 'gamble',
    run: async (client, message, args) => {
        if (cooldown.has(message.author.id)) return message.channel.send('Bạn phải chờ 5 giây để chơi tiếp!')
        cooldown.add(message.author.id)
        let player_deck = [];
        let bots_deck =  [];
        let maxbet = 100000;
        let backcard = '<:back:709983842542288899>'
        let listofcard = require('../../data/cardemojis.json').fulllist
        let hide_deck = []
        let userbet = args[0]
        if (!args[0] || (isNaN(args[0]) && args[0] !== 'all')) return message.channel.send('Vui lòng nhập số tiền cược.')
        userbet = parseInt(userbet)
        let usermoney = eco.fetchMoney(message.author.id)
        if (usermoney.amount < userbet || usermoney.amount == 0) return message.channel.send('Bạn không đủ tiền để cược')
        let bet = 1;
        if (userbet > maxbet || args[0] == 'all') bet = maxbet
        else if (userbet < maxbet) bet = userbet
        //3 lá 1 set
        for (let i = 0; i < 3; i++){
            player_deck.push(await randomcard(listofcard))
            listofcard.filter(e => e !== player_deck)
            bots_deck.push(await randomcard(listofcard))
            listofcard.filter(e => e !== player_deck)
            hide_deck.push(backcard)
        }
        let msg = await message.channel.send(createembed(message.author, bet, createembedfield(player_deck), createembedfield(bots_deck), getval(player_deck).point, getval(bots_deck).point, createembedfield(hide_deck), "not"));
        let userdata = getval(player_deck)
        let botdata = getval(bots_deck)
        let kind_of_winning = undefined;
        setTimeout(() => {
            cooldown.delete(message.author.id)
        }, ms('5s'))
        //check instant win?
        if (userdata.jqk === 3){
            //x3 tiền + win
            await money(message.author.id, 'thang', bet*3)
            return msg.edit(createembed(message.author, bet, createembedfield(player_deck), createembedfield(bots_deck), userdata.point, botdata.point, createembedfield(hide_deck), 'jqkwin'))
        } else if (botdata.jqk === 3){
            //mất tiền + thua
            await money(message.author.id, 'lose', bet)
            return msg.edit(createembed(message.author, bet, createembedfield(player_deck), createembedfield(bots_deck), userdata.point, botdata.point, createembedfield(hide_deck), 'jqklose'))
        }
        if (userdata.point == botdata.point){
            kind_of_winning = 'hoa'
        } else if (userdata.point > botdata.point){
            kind_of_winning = 'thang'
        } else kind_of_winning = 'thua'
        msg.edit(createembed(message.author, bet, createembedfield(player_deck), createembedfield(bots_deck), userdata.point, botdata.point, createembedfield(hide_deck), kind_of_winning))
        if (kind_of_winning !== 'hoa') await money(message.author.id, kind_of_winning, bet)
        setTimeout(() => {
            cooldown.delete(message.author.id)
        }, ms('5s'))
    }
}

function createembed(nguoichoi, bet, deck_user, deck_bot ,nguoichoi_val, bot_val, hidden_deck, end){
    let { MessageEmbed } = require('discord.js');
    let embed = new MessageEmbed()
            .setColor("#00FFFF")
            .setFooter('Game đang diễn ra')
            .setAuthor(`${nguoichoi.tag}, bạn đã cược ${laysodep(bet)} để chơi bài cào!`, nguoichoi.avatarURL())
            .setFooter("Đang chơi!")
    if (end == 'thang'){ 
        embed.setColor("#90EE90") //light green
        embed.footer.text = `Bạn thắng ${laysodep(bet)} tiền!`
        embed.addFields(
            {name: `Bot: [${bot_val}]`, value: deck_bot},
            {name: `User: [${nguoichoi_val}]`, value: deck_user}
        )
    } else if (end == 'thua'){ //thua
        embed.setColor("#FF0000") //red
        embed.footer.text = `Bạn thua ${laysodep(bet)} tiền!`
        embed.addFields(
            {name: `Bot: [${bot_val}]`, value: deck_bot},
            {name: `User: [${nguoichoi_val}]`, value: deck_user}
        )
    } else if (end == 'hoa') {//hoa
        embed.setColor("#D3D3D3") //light gray
        embed.footer.text = `Bạn không mất tiền cho trận đấu này`
        embed.addFields(
            {name: `Bot: [${bot_val}]`, value: deck_bot},
            {name: `User: [${nguoichoi_val}]`, value: deck_user}
        )
    } else if (end == 'not'){ //dangchoi
        embed.addFields(
            {name: `Bot: [?]`, value: hidden_deck},
            {name: `User: [${nguoichoi_val}]`, value: deck_user}
        )
    } else if (end == 'jqkwin'){
        embed.setColor("#77dd77") //pastel green
        embed.setTitle(`Bạn có 3 con tiên!`)
        embed.footer.text = `Bạn thắng ${laysodep(parseInt(bet.toString().replace(',', '')) *3)} tiền!`
        embed.addFields(
            {name: `Bot: [${bot_val}]`, value: deck_bot},
            {name: `User: [${nguoichoi_val}]`, value: deck_user}
        )
    } else if (end == 'jqklose'){
        embed.setColor("#FF0000") //red
        embed.setTitle(`Bot có 3 con tiên!`)
        embed.footer.text = `Bạn mất hết số tiền cược!`
        embed.addFields(
            {name: `Bot: [${bot_val}]`, value: deck_bot},
            {name: `User: [${nguoichoi_val}]`, value: deck_user}
        )
    }
    return embed;
}

function getval(list){
    var jqk = 0;
    var countpoint = 0;
    for (var i = 0; i < list.length; i++){
        let card = list[i].slice(2,3)
        if (!isNaN(card)){
            switch(parseInt(card)){
                case 1:
                    countpoint += 10;
                    break;
                default:
                    countpoint += parseInt(card)
                    break;
            }
        } else {
            switch(card){
                case "a":
                    countpoint++ //cộng 1
                    break;
                default: 
                    countpoint += 10;
                    jqk++;
                    break;
            }
        }
    }
    let realpoint = undefined;
    if (countpoint.toString().length == 1) realpoint = countpoint
    else realpoint = parseInt(countpoint.toString().slice(1));
    return {point: realpoint, jqk: jqk}
}

async function money(userid, kind, ammount){
    if (!userid || !ammount) return null;
    if (isNaN(ammount)) return null;
    if (kind == 'thang'){
        await eco.addMoney(userid, ammount)
    } else await eco.removeMoney(userid, ammount)
}