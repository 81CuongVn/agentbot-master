module.exports = {
    name: 'bug',
    category: 'settings',
    description: 'Bug lỗi',
    usage: 'bug <lỗi>',
    example: 'bug lệnh help lỗi rồi',
    run: async (client, message, args) => {
        if (!args[0]) return message.reply("Vui lòng chỉ định lỗi. Ví dụ:\n`lệnh help không hoạt động. Nó không hiện một số chữ`");
        if (args[0] === "bug") return message.reply("Vui lòng chỉ định lỗi. Ví dụ:\n`lệnh help không hoạt động. Nó không hiện một số chữ`");
        args = args.join(" ");
        message.reply("Cám ơn vì đã bug, chúng luôn ghi nhận việc làm của bạn! <a:check:742643729088643082>");
        const content = `**${message.author.username}#${message.author.discriminator}** (${message.author.id}) đã báo cáo:\n~~--------------------------------~~\n${args}\n~~--------------------------------~~\nỞ trong server: **${message.guild.name}**\nServer ID: **${message.guild.id}**`;
        client.channels.cache.get('702763834410008666').send(content)
      }
}
