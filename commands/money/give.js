const Eco = require('quick.eco');
const eco = new Eco.Manager;
const {laysodep} = require('../../functions')
module.exports = {
    name: 'give',
    aliases: ['transfer'],
    description: 'Chuyển tiền cho người khác!',
    usage: 'give <@tag or ID> <so tien>',
    VD: 'give @phamleduy04 50000',
    run: async (client, message, args) => {
        let member = message.mentions.members.first() || message.guild.members.cache.get(args[0])
        if (!member) return message.channel.send('Hãy tag hoặc đưa ID của người đó!')
        let ammount = args[1]
        if (!ammount) return message.channel.send('Hãy nhập số tiền cần chuyển.')
        if (eco.fetchMoney(message.author.id).amount < ammount) return message.channel.send('Bạn không đủ tiền để chuyển')
        eco.transfer(message.author.id, member.id, ammount)
        return message.channel.send(`Bạn đã chuyển thành công **${laysodep(ammount)}** tiền tới **${member.user.tag}**.`)
    }
}