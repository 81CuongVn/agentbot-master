const { MessageEmbed } = require("discord.js");
const { stripIndents } = require("common-tags");
const { promptMessage } = require('../../functions/utils');
const db = require('quick.db');
module.exports = {
    name: "ban",
    category: "moderation",
    description: "Ban người khác",
    usage: "ban <@tag, id> [lý do]",
    example: "ban @phamelduy04",
    run: async(client, message, args) => {
        let serverdata = db.get(message.guild.id);
        const logChannel = message.guild.channels.cache.get(serverdata.logchannel) || message.channel;

        if (message.deletable) message.delete();

        // No args
        if (!args[0]) return message.reply("Vui lòng tag một người nào đó để ban.").then(m => m.delete({timeout: 5000}));
        let reason = args.slice(1).join(' ')
        // No reason
        if (!args[1]) reason = "Không có lý do."
        

        // No author permissions
        if (!message.member.hasPermission("BAN_MEMBERS")) {
            return message.reply("❌ Bạn không có quyền để ban người khác.")
                .then(m => m.delete({timeout: 5000}));

        }
        // No bot permissions
        if (!message.guild.me.hasPermission("BAN_MEMBERS")) {
            return message.reply("❌ Bot không có quyền ban người khác, vui lòng kiểm tra lại.")
                .then(m => m.delete({timeout: 5000}));
        }

        const toBan = message.mentions.members.first() || message.guild.members.cache.get(args[0]);

        // No member found
        if (!toBan) {
            return message.reply("Không tìm thấy người cần ban, vui lòng thử lại.")
                .then(m => m.delete({timeout: 5000}));
        }

        // Can't ban urself
        if (toBan.id === message.author.id) {
            return message.reply("Bạn không thể tự ban chính mình.")
                .then(m => m.delete({timeout: 5000}));
        }

        // Check if the user's banable
        if (!toBan.bannable) {
            return message.reply("Mình không thể ban người này vì người này role cao hơn mình.")
                .then(m => m.delete({timeout: 5000}));
        }

        const embed = new MessageEmbed()
            .setColor("#ff0000")
            .setThumbnail(toBan.user.avatarURL())
            .setFooter(message.member.displayName, message.author.avatarURL())
            .setTimestamp()
            .setDescription(stripIndents `**- Đã ban:** ${toBan} (${toBan.id})
            **- Người ban:** ${message.member} (${message.member.id})
            **- Lý do:** ${reason}`);

        const promptEmbed = new MessageEmbed()
            .setColor("GREEN")
            .setAuthor(`Hãy trả lời trong 30s`)
            .setDescription(`Bạn có muốn ban ${toBan}?`)

        // Send the message
        await message.channel.send(promptEmbed).then(async msg => {
            // Await the reactions and the reactioncollector
            const emoji = await promptMessage(msg, message.author, 30, ["✅", "❌"]);

            // Verification stuffs
            if (emoji === "✅") {
                msg.delete();
                toBan.send(`Bạn vừa bị ban ở server \`${toBan.guild.name}\`. Lý do: \`${args.slice(1).join(' ')}\``)
                toBan.ban(reason)
                    .catch(err => {
                        if (err) return message.channel.send(`Bị lỗi khi ban: ${err.message}`)
                    });

                logChannel.send(embed);
            } else if (emoji === "❌") {
                msg.delete();

                message.reply(`Đã huỷ ban`)
                    .then(m => m.delete({timeout: 10000}));
            }
        });
    }
};