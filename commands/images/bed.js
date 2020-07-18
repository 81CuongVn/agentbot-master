const Canacord = require('canvacord');
const canva = new Canacord();
const { MessageAttachment } = require('discord.js');
module.exports = {
    name: "bed",
    category: 'images',
    description: 'bed =))',
    usage: 'bed [@tag]',
    run: async (client, message, args) => {
        let url1 = message.author.avatarURL({format: 'png', dynamic: false})
        let nguoitag = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.member
        let avaurl = nguoitag.user.avatarURL({format: 'png', dynamic: false})
        let image = await canva.bed(url1, avaurl)
        let attach = new MessageAttachment(image, 'bed.png')
        return message.channel.send(attach)
    }
}