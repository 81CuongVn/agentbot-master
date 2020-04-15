const { MessageEmbed } = require("discord.js");
module.exports = {
    name: "ship",
    category: "fun",
    description: "Shippppppp",
    usage: "_ship <tag> <tag2>",
    run: async(client, message, args) => {
        let nguoitag = message.mentions.members.array()
        if (!args[0] || nguoitag.length !== 2) return message.reply("Bạn phải tag 2 người để mình ship nha D:")
        let person = nguoitag[0]
        let person1 = nguoitag[1]
        const love = Math.random() * 100;
        const loveIndex = Math.floor(love / 10);
        const loveLevel = "💖".repeat(loveIndex) + "💔".repeat(10 - loveIndex);
        const embed = new MessageEmbed()
            .setColor("#ffb6c1")
            .addField(`☁ Tỉ lệ thành công của cặp đôi **${person.displayName}** và **${person1.displayName}**:`,
                `💟 ${Math.floor(love)}%\n\n${loveLevel}`);
        message.channel.send(embed);
    }
}