const Eco = require('quick.eco');
const eco = new Eco.Manager();
const coin_gif = '<a:coin:710976678561841153>'
const random = ['head', 'tail']
const dict = {
    'head': '<:head:710976679203438703>',
    'tail': '<:tail:710976679568474202>'
}
const { laysodep, sleep } = require('../../functions/utils');
const ms = require('ms');
module.exports = {
    name: 'coinflip',
    aliases: ['cf'],
    cooldown: 5,
    category: 'gamble',
    description: 'Tung đồng xu (50%)',
    usage: 'coinflip <user_choose> <tiền cược>',
    example: 'coinflip t 50000',
    run: async (client, message, args) => {
        let maxbet = 500000;
        let user_choose = args[0]
        if (!user_choose || user_choose == 'all' || !isNaN(user_choose)) return message.channel.send('Vui lòng chọn head hoặc tail.')
        switch(user_choose.toLowerCase()){
            case 't' || 'tail':{
                user_choose = 'tail';
                break;
            }
            default:{
                user_choose = 'head'
                break;
            }
        }
        let userdata = eco.fetchMoney(message.author.id);
        let bet = undefined;
        if (args[1] == 0 || userdata.amount == 0) return message.channel.send('Bạn không thể cược 0.')
        if (args[1] == 'all') {
            bet = 100000;
            if (bet > userdata.amount) bet = userdata.amount
        }
        else if (isNaN(args[1])) return message.channel.send('Vui lòng nhập tiền cược!');
        else bet = args[1]
        if (bet > parseInt(userdata.amount)) return message.channel.send('Bạn không có đủ tiền để chơi!')
        else if (bet > maxbet) bet = maxbet
        await message.channel.send(`${coin_gif} **${message.author.tag}** cược **${laysodep(bet)}** và đã chọn **${user_choose}**!`)
        //random
        let userrand = random[Math.floor(Math.random() * random.length)]
        let final = check(user_choose, userrand)
        sleep(ms('4s'));
        if (final === true){
            //win
            message.channel.send(`Và kết quả là ${dict[userrand]}(**${userrand}**), bạn đã thắng **${laysodep(bet)}**.`)
            await money(message.author.id, 'win', bet)
        } else if (final === false){
            message.channel.send(`Và kết quả là ${dict[userrand]}(**${userrand}**), bạn đã mất hết tiền cược.`)
            await money(message.author.id, 'lose', bet)
            //lose
        } else {
            message.channel.send('Bot lỗi, bạn sẽ không bị trừ tiền!')
            //k trừ tiền
        }
    }
}

function check(user_choose, userrand){
    if (!user_choose || !userrand) return null;
    if (user_choose == userrand) return true;
    else return false;
}

async function money(userid, kind, bet){
    if (!userid || !bet) return null;
    if (kind == 'win'){
        await eco.addMoney(userid, bet)
    } else {
        await eco.removeMoney(userid, bet)
    }
}