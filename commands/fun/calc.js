const math = require('mathjs');
const { MessageEmbed } = require("discord.js");
module.exports = {
    name: "calc",
    category: "fun",
    description: "Tính toán nhanh",
    note: "Căn bậc 2 sử dụng sqrt(), đổi đơn vị (cm to inch), v.v",
    run: async(client, message, args) => {
        if (!args[0]) return message.reply("Nhập phép tính để tính chứ bạn ơi :(")
        let resp;
        try {
            resp = math.evaluate(args.join(' '));
        } catch (e) {
            return message.channel.send("Mình không giải được :(")
        }
        const embed = new MessageEmbed()
            .setColor(0xffffff)
            .setTitle('Math Calculation')
            .addField('Input', `\`\`\`${args.join(' ')}\`\`\``)
            .addField('Output', `\`\`\`js\n${resp}\`\`\``)
        message.channel.send(embed)
    }

}