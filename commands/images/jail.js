const Canvacord = require('canvacord');
const canva = new Canvacord();
const { MessageAttachment } = require('discord.js')
module.exports = {
    name: 'jail',
    category: 'images',
    description: 'Cho vào tù =]]',
    usage: 'jail [@tag]',
    run: async (client, message, args) => {
        let nguoitag = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.member
        let avaurl = nguoitag.user.avatarURL({ format: 'png', dynamic: false })
        let image = await canva.jail(avaurl)
        let attachment = new MessageAttachment(image, 'jail.png')
        return message.channel.send(attachment)
    }
}