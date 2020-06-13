const { MessageEmbed } = require("discord.js");
const { stripIndents } = require("common-tags");
const { getMember, formatDate, trimArray} = require("../../functions.js");

module.exports = {
    name: "whois",
    aliases: ["who", "user", "info"],
    category: "info",
    description: "Returns user information",
    usage: "whois <tag,username,ID>",
    run: (client, message, args) => {
        const member = getMember(message, args.join(" "));
            // Member variables
        const joined = formatDate(member.joinedAt);
        const roles = member.roles.cache
            .sort((a, b) => b.position - a.position)
            .filter(r => r.id !== message.guild.id)
            .map(r => r)
        roles.join(", ") || 'none';
        // User variables
        const created = formatDate(member.user.createdAt);

        const embed = new MessageEmbed()
            .setFooter(member.displayName, member.user.avatarURL())
            .setThumbnail(member.user.avatarURL())
            .setColor(member.displayHexColor === '#000000' ? '#ffffff' : member.displayHexColor)

        .addField('Member information:', stripIndents `**- Display name:** ${member.displayName}
            **- Joined at:** ${joined}
            **- Roles:** ${roles.length < 10 ? roles.join(', ') : roles.length > 10 ? trimArray(roles, 10) : 'None'}`, true)

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