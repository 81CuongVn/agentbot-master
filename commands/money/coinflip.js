const Eco = require('quick.eco');
const eco = new Eco.Manager();
const coin_gif = '<a:coin:710976678561841153>'
const random = ['head', 'tail']
const dict = {
    'head': '<:head:710976679203438703>',
    'tail': '<:tail:710976679568474202>'
}
const {laysodep, sleep} = require('../../functions');
const ms = require('ms');
module.exports = {
    name: 'coinflip',
    aliases: ['cf'],
    description: 'Tung đồng xu (50%)',
    usage: 'coinflip <user_choose> <ammount>',
    VD: 'coinflip t 50000',
    run: async (client, message, args) => {
        let maxbet = 100000;
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
        let ammount = args[1]
        if (!ammount || (isNaN(ammount) && ammount !== 'all')) return message.channel.send('Vui lòng nhập số tiền cược!')
        let usermoney = eco.fetchMoney(message.author.id).amount
        if (usermoney < ammount || usermoney == 0) return message.channel.send('Bạn không đủ tiền để chơi!')
        if (args[1] == "all"){
            if (usermoney > maxbet) ammount = maxbet
            else ammount = usermoney
        } else ammount = parseInt(ammount)
        await message.channel.send(`${coin_gif} **${message.author.tag}** cược **${laysodep(ammount)}** và đã chọn **${user_choose}**!`)
        //random
        let userrand = random[Math.floor(Math.random() * random.length)]
        let final = check(user_choose, userrand)
        sleep(ms('4s'));
        if (final === true){
            //win
            message.channel.send(`Và kết quả là **${dict[userrand]}**(${userrand}), bạn đã thắng **${laysodep(ammount)}**`)
            await money(message.author.id, 'win', ammount)
        } else if (final === false){
            message.channel.send(`Và kết quả là **${dict[userrand]}**(${userrand}), bạn đã mất hết tiền cược.`)
            await money(message.author.id, 'lose', ammount)
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

async function money(userid, kind ,ammount){
    if (!userid || !ammount) return null;
    if (kind == 'win'){
        await eco.addMoney(userid, ammount)
    } else {
        await eco.removeMoney(userid, ammount)
    }
}