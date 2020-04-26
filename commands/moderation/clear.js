module.exports = {
    name: "clear",
    aliases: ["purge"],
    category: "moderation",
    description: "Xoá tin nhắn",
    usage: "clear <số tin nhắn>",
    run: async(client, message, args) => {
        await message.delete();

        // Member doesn't have permissions
        if (!message.member.hasPermission("MANAGE_MESSAGES")) {
            return message.reply("Bạn không có quyền MANAGE_MESSAGES").then(m => m.delete({timeout: 5000}));
        }

        // Check if args[0] is a number
        if (isNaN(args[0]) || parseInt(args[0]) <= 0) {
            return message.reply("Vui lòng nhập số để bot có thể xoá").then(m => m.delete({timeout: 5000}));
        }

        // Maybe the bot can't delete messages
        if (!message.guild.me.hasPermission("MANAGE_MESSAGES")) {
            return message.reply("Bot không có quyền MMANAGE_MESSAGES nên bot không thể xoá.").then(m => m.delete({timeout: 5000}));
        }

        let deleteAmount = 0;

        if (parseInt(args[0]) > 100) {
            deleteAmount = 100;
        } else {
            deleteAmount = parseInt(args[0]);
        }

        message.channel.bulkDelete(deleteAmount, true)
            .then(deleted => message.channel.send(`Đã xoá **${deleted.size}** messages.`)).then(m => m.delete({timeout: 5000}))
    }
}