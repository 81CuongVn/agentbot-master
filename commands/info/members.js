let SS = require('string-similarity');
const { MessageEmbed } = require('discord.js');
const { trimArray } = require('../../functions/utils')
module.exports = {
    name: "members",
    aliases: ['member'],
    category: "info",
    description: "Xem member của 1 role nhất định.",
    usage: "members <role_name>",
    run: async(client, message, args) => {
        if (!args[0]) return message.reply(`Ghi tên role giúp mình với D:`).then(m => m.delete({timeout: 5000}))
        var role = message.guild.roles.cache.get(args[0])
        if (!role) {
            role = message.guild.roles.cache.filter(r => r.managed === false).array().map(g => g.name)
            var search = args.join(' ')
            var matches = SS.findBestMatch(search, role)
            role = message.guild.roles.cache.find(role => role.name == matches.bestMatch.target)
        }
        var members = role.members.map(m => m.user)
        const embed = new MessageEmbed()
            .setTitle(`Thành viên trong \`${role.name}\``)
            .setDescription(members.length < 30 ? members.join('\n') : members.length > 30 ? trimArray(members, 30) : 'None')
            .setFooter(`Số người có role này: ${role.members.size}`)
        message.channel.send(embed)
    }
}