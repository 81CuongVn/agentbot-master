const { MessageEmbed } = require('discord.js')
module.exports = {
    name: "avatar",
    aliases: ["ava", "avt"],
    category: "info",
    description: "Xem avatar của người khác",
    usage: "avatar <tag>",
    example: "avatar @phamleduy04",
    run: (client, message, args) => {
        const embed = new MessageEmbed()
        var member = message.mentions.members.first() || message.guild.members.cache.get(args[0])
        if (member) {
            var avaurl = member.user.avatarURL({ format: 'jpg', dynamic: true, size: 1024 })
        } else {
            var avaurl = message.author.avatarURL({ format: 'jpg', dynamic: true, size: 1024 })
        }
        embed.setImage(avaurl)
        embed.setTitle(`Link avatar: `)
        embed.setURL(avaurl)
        message.channel.send(embed)
    }
}