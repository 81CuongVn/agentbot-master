const Canacord = require('canvacord');
const canva = new Canacord.Canvas();
const { MessageAttachment } = require('discord.js');
module.exports = {
    name: "hitler",
    run: async (client, message, args) => {
        let nguoitag = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.member
        let avaurl = nguoitag.user.avatarURL({format: 'png', dynamic: false})
        let image = await canva.hitler(avaurl)
        let attach = new MessageAttachment(image, 'hitler.png')
        return message.channel.send(attach)
    }
}