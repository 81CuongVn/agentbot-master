const { MessageEmbed } = require("discord.js");
const { stripIndents } = require("common-tags");
const { getMember, formatDate } = require("../../functions.js");

module.exports = {
    name: "whois",
    aliases: ["who", "user", "info"],
    category: "info",
    description: "Returns user information",
    usage: "_whois <tag,username,ID>",
    run: (client, message, args) => {
        const member = getMember(message, args.join(" "));
        let gtrole = message.guild.roles.cache.get('684848725574680689')
        let qgrole = message.guild.roles.cache.get('684848710605078571')
        let gamerole = message.guild.roles.cache.get('684848750795161644')
        let statusrole = message.guild.roles.cache.get('684848749004193798')
            // Member variables
        const joined = formatDate(member.joinedAt);
        const roles = member.roles.cache
            .filter(r => r.id !== message.guild.id)
            .map(r => r)
        roles.splice(roles.indexOf(gtrole), 1);
        roles.splice(roles.indexOf(qgrole), 1);
        roles.splice(roles.indexOf(gamerole), 1);
        roles.splice(roles.indexOf(statusrole), 1);
        roles.join(", ") || 'none';
        // User variables
        const created = formatDate(member.user.createdAt);

        const embed = new MessageEmbed()
            .setFooter(member.displayName, member.user.avatarURL())
            .setThumbnail(member.user.avatarURL())
            .setColor(member.displayHexColor === '#000000' ? '#ffffff' : member.displayHexColor)

        .addField('Member information:', stripIndents `**- Display name:** ${member.displayName}
            **- Joined at:** ${joined}
            **- Roles:** ${roles}`, true)

        .addField('User information:', stripIndents `**- ID:** ${member.user.id}
            **- Username**: ${member.user.username}
            **- Tag**: ${member.user.tag}
            **- Created at**: ${created}`, true)

        .setTimestamp()

        if (member.user.presence.game)
            embed.addField('Currently playing', stripIndents `** Name:** ${member.user.presence.game.name}`);

        message.channel.send(embed);
    }
}