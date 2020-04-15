const talkedRecently = new Set();
const ms = require('ms')
module.exports = {
    name: "crush",
    category: "fun",
    description: "Tìm crush của bạn",
    run: async(client, message, args) => {
        if (talkedRecently.has(message.author.id)) {
            message.reply(`Vui lòng chờ sau 5 giây từ khi nhập lệnh......`)
        } else {
            talkedRecently.add(message.author.id)
            var person = message.guild.members.cache.filter(m => !m.user.bot).random()
            message.channel.send(`**${person.displayName}** muốn xơi **${message.member.displayName}** từ lâu......`);
            setTimeout(() => {
                talkedRecently.delete(message.author.id)
            }, ms('5s'))
        }
    }
}