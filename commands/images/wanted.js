const Canvacord = require('canvacord');
const canva = new Canvacord();
const { MessageAttachment } = require('discord.js');
module.exports = {
    name: 'wanted',
    aliases: ['truyna'],
    category: 'images',
    description: 'Truy nã',
    usage: 'truyna',
    run: async (client, message, args) => {
        let nguoitag = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.member
        let avaurl = nguoitag.user.avatarURL({ format: 'png', dynamic: false })
        let image = await canva.wanted(avaurl);
        let attach = new MessageAttachment(image, 'wanted.png')
        return message.channel.send(attach)
    }
}