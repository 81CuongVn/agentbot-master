const Canvacord = require('canvacord');
const canva = new Canvacord();
const {MessageAttachment} = require('discord.js')
module.exports = {
    name: "trigger",
    category: "images",
    description: "Triggererrreerere",
    usage: "trigger [@tag]",
    example: "trigger @phamleduy04",
    run: async (client, message, args) => {
        let nguoitag = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.member
        let avaurl = nguoitag.user.avatarURL({format: 'png', dynamic: false})
        let image = await canva.trigger(avaurl)
        let attach = new MessageAttachment(image, 'trigger.gif')
        return message.channel.send(attach)
    }
}