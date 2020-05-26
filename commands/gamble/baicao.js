const Eco = require('quick.eco');
const eco = new Eco.Manager();
const {randomcard, createembedfield, laysodep, locbai} = require('../../functions');
const cooldown = new Map();
const Duration = require('humanize-duration');
const timerEmoji = '<a:timer:714891786274734120>';
const ms = require('ms');
const doubledownEmoji = "👌";
const stopEmoji = "🛑";
module.exports = {
    name: 'baicao',
    aliases: ['bc'],
    description: 'bài cào',
    category: 'gamble',
    run: async (client, message, args) => {
        if (cooldown.get(message.author.id)) return message.channel.send(`${timerEmoji} Bạn cần phải đợi thêm \`${Duration(cooldown.get(message.author.id) - Date.now(), {units: ['s'], round: true, language: 'vi'})}\` để có thể sử dụng tiếp lệnh này!`)
        let player_deck = [];
        let bots_deck =  [];
        let maxbet = 500000;
        let backcard = '<:back:709983842542288899>'
        let listofcard = require('../../data/cardemojis.json').fulllist
        let hide_deck = []
        let bet = undefined;
        let userdata = eco.fetchMoney(message.author.id);
        if (args[0] == 'all') bet = 100000;
        else if (args[0] > parseInt(userdata.amount)) return message.channel.send('Bạn không có đủ tiền để chơi!')
        else if (isNaN(args[0])) return message.channel.send('Vui lòng nhập tiền cược!');
        else if (args[0] <= parseInt(userdata.amount) && args[0] < maxbet) bet = args[0]
        else if (args[0] <= parseInt(userdata.amount) && args[0] >= maxbet) bet = maxbet
        else return message.channel.send('Bạn không có đủ tiền để chơi!')
        cooldown.set(message.author.id, Date.now() + ms('5s'));
        //3 lá 1 set
        for (let i = 0; i < 3; i++){
            player_deck.push(await randomcard(listofcard))
            listofcard = locbai(listofcard, player_deck)
            bots_deck.push(await randomcard(listofcard))
            listofcard = locbai(listofcard, bots_deck)
            hide_deck.push(backcard)
        }
        let msg = await message.channel.send(createembed(message.author, bet, createembedfield(player_deck), createembedfield(bots_deck), getval(player_deck).point, getval(bots_deck).point, createembedfield(hide_deck), "not"));
        let usercard = getval(player_deck)
        let botdata = getval(bots_deck)
        setTimeout(() => {
            cooldown.delete(message.author.id)
        }, ms('5s'))
        if (usercard.jqk === 3){
            //x3 tiền + win
            await money(message.author.id, 'thang', bet*3)
            return msg.edit(createembed(message.author, bet, createembedfield(player_deck), createembedfield(bots_deck), usercard.point, botdata.point, createembedfield(hide_deck), 'jqkwin'))
        } else if (botdata.jqk === 3){
            //mất tiền + thua
            await money(message.author.id, 'lose', bet)
            return msg.edit(createembed(message.author, bet, createembedfield(player_deck), createembedfield(bots_deck), usercard.point, botdata.point, createembedfield(hide_deck), 'jqklose'))
        }
        if (userdata.amount >= bet) msg.react(doubledownEmoji)
        msg.react(stopEmoji)
        const filter = (reaction, user) => {
            return (reaction.emoji.name === doubledownEmoji || reaction.emoji.name === stopEmoji) && user.id === message.author.id
        }
        let collector = msg.createReactionCollector(filter, {time: ms('1m')})
        collector.on('collect', async (reaction, user) => {
            if (reaction.emoji.name === doubledownEmoji){
                //check người ta có đủ điều kiện để cược x2
                bet = bet * 2
                await stop(usercard, botdata, bet, message.author, player_deck, bots_deck, hide_deck, msg)
            } else if (reaction.emoji.name === stopEmoji){
                await stop(usercard, botdata, bet, message.author, player_deck, bots_deck, hide_deck, msg)
            }
        })        
    }
}

async function stop(usercard, botdata, bet, user, player_deck, bots_deck, hide_deck, msg) {
    let kind_of_winning = undefined;
        if (usercard.point == botdata.point){
            kind_of_winning = 'hoa'
        } else if (usercard.point > botdata.point){
            kind_of_winning = 'thang'
        } else kind_of_winning = 'thua'
        msg.edit(createembed(user, bet, createembedfield(player_deck), createembedfield(bots_deck), usercard.point, botdata.point, createembedfield(hide_deck), kind_of_winning))
        if (kind_of_winning !== 'hoa') await money(user.id, kind_of_winning, bet)  
}

function createembed(nguoichoi, bet, deck_user, deck_bot ,nguoichoi_val, bot_val, hidden_deck, end){
    let { MessageEmbed } = require('discord.js');
    let embed = new MessageEmbed()
            .setColor("#00FFFF")
            .setTitle(`Chọn ${doubledownEmoji} để cược gấp đôi nếu bạn tự tin.`)
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

