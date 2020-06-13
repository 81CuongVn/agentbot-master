let SS = require('string-similarity');
const { MessageEmbed } = require('discord.js');
const { trimArray } = require('../../functions')
module.exports = {
    name: "members",
    category: "info",
    description: "Xem member của 1 role nhất định.",
    usage: "members <role_name>",
    run: async(client, message, args) => {
        if (!args[0]) return message.reply(`Ghi tên role giúp mình với D:`).then(m => m.delete({timeout: 5000}))
        var roles = message.guild.roles.cache.filter(r => r.managed === false).array().map(g => g.name)
        var search = args.join(' ')
        var matches = SS.findBestMatch(search, roles)
        var members = message.guild.roles.cache.find(role => role.name == matches.bestMatch.target).members.map(m => m.user)
        const embed = new MessageEmbed()
            .setTitle(`Thành viên trong role ${matches.bestMatch.target}`)
            .setDescription(members.length < 30 ? members.join('\n') : roles.length > 30 ? trimArray(members, 30) : 'None')
        message.channel.send(embed)
    }
}