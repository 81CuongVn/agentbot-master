const { MessageEmbed } = require("discord.js");
const axios = require('axios');
module.exports = {
    name: "pat",
    category: "images",
    description: "pat someone :D ",
    usage: "_pat [@tag]",
    run: async (client, message, args) => {
        try {
            let nguoitag = message.mentions.members.array() || message.guild.members.cache.get(args[0]);
            const embed = new MessageEmbed()
            await axios.get('https://some-random-api.ml/animu/pat').then(response => {
                if (nguoitag.length == 0) {
                    embed.setDescription(`${message.member.displayName} vỗ về đã tất cả mọi người ♥`)
                        .setImage(response.data.link);
                } else {
                    embed.setDescription(`Awwww, ${message.member} đã vỗ về ${nguoitag} ♥`)
                        .setImage(response.data.link);
                }   
                message.channel.send(embed)
            })
        }
        catch(e){
            console.log(e);
            return message.channel.send("Bot lỗi khi cố gắng lấy hình, hãy thử lại sau");
        }
    }
}