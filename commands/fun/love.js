const { MessageEmbed } = require("discord.js");
const { getMember } = require('../../functions/utils');

module.exports = {
    name: "love",
    category: "fun",
    description: "Người khác yêu bạn cỡ nào?",
    usage: "love [mention or id or username]",
    example: `love @phamleduy04`,
    run: async(client, message, args) => {
        // Get a member from mention, id, or username
        let person = getMember(message, args[0]);

        if (!person || !args[0]) {
            person = message.guild.members.cache
                .filter(m => m.id !== message.author.id && !m.user.bot)
                .random();
        }
        if (message.author.id === person.id)
            return message.reply("Bạn không thể đo tình yêu dành cho chính bản thân vì nó luôn luôn là 100%");


        const love = Math.random() * 100;
        const loveIndex = Math.floor(love / 10);
        const loveLevel = "💖".repeat(loveIndex) + "💔".repeat(10 - loveIndex);

        const embed = new MessageEmbed()
            .setColor("#ffb6c1")
            .addField(`☁ **${person.displayName}** loves **${message.member.displayName}** this much:`,
                `💟 ${Math.floor(love)}%\n\n${loveLevel}`);

        message.channel.send(embed);
    }
}