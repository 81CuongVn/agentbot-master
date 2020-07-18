const Canvacord = require('canvacord');
const canva = new Canvacord();
const {MessageAttachment} = require('discord.js')
module.exports = {
    name: "rip",
    category: "images",
    description: "Cho vào ảnh bia mộ =))",
    usage: "rip [@tag]",
    example: "rip @phamleduy04",
    run: async (client, message, args) => {
        let nguoitag = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.member
        let avaurl = nguoitag.user.avatarURL({format: 'png', dynamic: false})
        let image = await canva.rip(avaurl)
        let attach = new MessageAttachment(image, 'rip.png')
        return message.channel.send(attach)
    }
}