const Canvacord = require('canvacord');
const canva = new Canvacord();
const {MessageAttachment} = require('discord.js')
module.exports = {
    name: "delete",
    aliases: ["del"],
    category: "images",
    description: "Delete meme",
    usage: "delete [@tag]",
    example: "delete @phamleduy04",
    run: async (client, message, args) => {
        let nguoitag = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.member
        let avaurl = nguoitag.user.avatarURL({format: 'png', dynamic: false})
        let image = await canva.delete(avaurl)
        let attach = new MessageAttachment(image, 'delete.png')
        return message.channel.send(attach)
    }
}