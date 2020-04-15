const { MessageEmbed } = require("discord.js");
let stringSimilarity = require('string-similarity');

module.exports = {
    name: "roleinfo",
    category: "info",
    description: "Trà về thông tên về role",
    run: async(client, message, args) => {
        let roles = message.guild.roles.cache.filter(r => r.managed === false).map(g => g.name)
        var search = args.join(' ');
        var matches = stringSimilarity.findBestMatch(search, roles)
        var find = matches.bestMatch.target
        var role = message.guild.roles.cache.find(role => role.name === find)
        if (!isNaN(args[0])) {
            var role = message.guild.roles.cache.get(args[0])
        }
        let membersWithRole = message.guild.roles.cache.get(role.id).members;
        const embed = new MessageEmbed()
            .setColor(role.color)
            .setTitle("Roleinfo")
            .addField("ID: ", role.id)
            .addField("Tên role: ", role.name, true)
            .addField("Số lượng:", membersWithRole.size, true)
            .addField("Vị trí: ", role.position, true)
            .addField("Mentionable: ", role.mentionable, true)
            .addField("Hoist: ", role.hoist, true)
            .addField("Màu: ", role.hexColor, true)
        message.channel.send(embed)
    }
}