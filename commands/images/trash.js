const Canvacord = require('canvacord');
const canva = new Canvacord();
const {MessageAttachment} = require('discord.js')
module.exports = {
    name: "trash",
    category: "images",
    description: "Bỏ vào thùng rác",
    usage: "trash [@tag]",
    example: "trash @phamleduy04",
    run: async (client, message, args) => {
        let nguoitag = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.member
        let avaurl = nguoitag.user.avatarURL({format: 'png', dynamic: false})
        let image = await canva.trash(avaurl)
        let attach = new MessageAttachment(image, 'trash.png')
        return message.channel.send(attach)
    }
}