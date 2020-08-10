const Eco = require('quick.eco');
const eco = new Eco.Manager;
const {laysodep} = require('../../functions/utils')
module.exports = {
    name: 'give',
    category: 'gamble',
    aliases: ['transfer'],
    description: 'Chuyển tiền cho người khác!',
    usage: 'give <@tag or ID> <so tien>',
    example: 'give @phamleduy04 50000',
    run: async (client, message, args) => {
        let member = message.mentions.members.first() || message.guild.members.cache.get(args[0])
        let authordata = eco.fetchMoney(message.author.id)
        if (!member) return message.channel.send('Hãy tag hoặc đưa ID của người đó!')
        let sotienchuyen = args[1]
        if (!sotienchuyen || isNaN(sotienchuyen)) return message.channel.send('Hãy nhập số tiền cần chuyển.')
        if (authordata.amount < sotienchuyen) return message.channel.send('Bạn không đủ tiền để chuyển')
        await eco.transfer(message.author.id, member.id, sotienchuyen)
        return message.channel.send(`Bạn đã chuyển thành công **${laysodep(sotienchuyen)}** tiền tới **${member.user.tag}**.`)
    }
}