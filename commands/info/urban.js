const urban = require('relevant-urban');
const { MessageEmbed } = require("discord.js");
module.exports = {
    name: "urban",
    category: "info",
    description: "Từ điển từ lóng của Tiếng Anh",
    usage: "urban <query>",
    example: "urban yeet",
    run: async(client, message, args, tools) => {
        if (!args[0]) return message.reply(`Bạn phải nhập gì đó để mình tìm chứ`);
        if (!message.channel.nsfw) return  message.channel.send("Lệnh này chỉ sử dụng được ở channel có bật mode NSFW!");
        //Fetch from urban dict
        let res = await urban(args.join(' ')).catch(e => {
            return "not found"
        });
        if (res == "not found") return message.channel.send(`Không tìm thấy từ **${args.join(' ')}**`)
        const embed = new MessageEmbed()
            .setColor('RANDOM')
            .setTitle(res.word)
            .setURL(res.urbanURL)
            .setDescription(`**Definition:**\n*${res.definition}*\n\n**Example:**\n${res.example}*`)
            .addField('Author: ', res.author, true)
            .addField('Rating: ', `**\`Upvotes: ${res.thumbsUp} | Downvotes: ${res.thumbsDown}\`**`)
        message.channel.send(embed);
    }
}