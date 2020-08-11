const wolfarm_key = process.env.WOLFARM;
const axios = require('axios');
const { MessageEmbed } = require('discord.js');
module.exports = {
    name: "wolf",
    category: "info",
    description: "Hỏi gì cũng được",
    note: 'Hỏi bằng tiếng anh',
    example: "wolf GDP of vietnam",
    usage: "wolf <query>",
    run: async (client, message, args) => {
        var query = encodeURIComponent(args.join(' '));
        let data = await axios.get(`https://api.wolframalpha.com/v2/query?input=${query}&format=image&output=JSON&appid=${wolfarm_key}`)
        .catch(err => {
            if (err) return message.channel.send(`Bot lỗi: ${err.message}`)
        })
        data = data.data
        if (data.queryresult.success === false) return message.reply("Mình không hiểu bạn đang hỏi gì, vui lòng hỏi câu khác.")
        const embed = new MessageEmbed()
            .setTitle(`Question: ${args.join(' ')}`)
            .setTimestamp()
            .setImage(data.queryresult.pods[1].subpods[0].img.src)
        message.channel.send(embed)
    }
}