module.exports = {
    name: "crush",
    category: "fun",
    description: "Tìm crush của bạn",
    cooldown: 2,
    run: async(client, message, args) => {
        let person = message.guild.members.cache.filter(m => !m.user.bot && m.user.id == message.author.id).random()
        if (!person) person = message.author;
        message.channel.send(`**${person.displayName}** muốn xơi **${message.member.displayName}** từ lâu......`);
    }
}