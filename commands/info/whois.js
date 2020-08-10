const { MessageEmbed } = require("discord.js");
const { stripIndents } = require("common-tags");
const { getMember, formatDate, trimArray } = require('../../functions/utils');
const flags = require('../../assets/userflag.json');
module.exports = {
    name: "whois",
    aliases: ["who", "user", "info"],
    category: "info",
    description: "Returns user information",
    usage: "whois <tag,username,ID>",
    run: async (client, message, args) => {
        const member = getMember(message, args.join(' '));
            // Member variables
        const joined = formatDate(member.joinedAt);
        const roles = member.roles.cache
            .sort((a, b) => b.position - a.position)
            .filter(r => r.id !== message.guild.id)
            .map(r => r)
        roles.join(", ") || 'none';
        // User variables
        const created = formatDate(member.user.createdAt);
        let userFlags = ""
        if (member.user.flags) userFlags = member.user.flags.toArray()
        const embed = new MessageEmbed()
            .setFooter(member.displayName, member.user.avatarURL())
            .setThumbnail(member.user.avatarURL())
            .setColor(member.displayHexColor === '#000000' ? '#ffffff' : member.displayHexColor)

        .addField('Thông tin thành viên (server):', stripIndents `**- Nickname:** ${member.displayName}
            **- Vào server vào ngày:** ${joined}
            **- Roles:** ${roles.length < 10 ? roles.join(', ') : roles.length > 10 ? trimArray(roles, 10) : 'None'}`, true)

        .addField('Thông tin người dùng:', stripIndents `**- ID:** ${member.user.id}
            **- Tên người dùng**: ${member.user.username}
            **- Tag**: ${member.user.tag}
            **- Tạo vào lúc**: ${created}
            **- Huy hiệu**: ${userFlags.length ? userFlags.map(flag => flags[flag]).join(", ") : "Không có" }`, true)

        .setTimestamp()
        if (member.user.presence.activities.length > 0)
            embed.addField('Đang chơi: ', stripIndents `** Tên game:** ${member.user.presence.activities[0].name}`);

        message.channel.send(embed);
    }
}