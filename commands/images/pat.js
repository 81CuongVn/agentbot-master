const { MessageEmbed } = require("discord.js");
var getJSON = require("get-json");
module.exports = {
    name: "pat",
    category: "images",
    description: "pat someone :D ",
    usage: "_pat [@tag]",
    run: (client, message, args) => {
        let url = `https://some-random-api.ml/animu/pat`
        getJSON(url, function(error, response) {
            if (error) return message.reply("Bot lỗi trong khi cố gắng lấy hình, vui lòng thử lại sau")
            let nguoitag = message.mentions.members.array() || message.guild.members.get(args[0])
            if (nguoitag.length == 0) {
                const embed1 = new MessageEmbed()
                    .setDescription(`${message.member.displayName} vỗ về đã tất cả mọi người <3`)
                    .setImage(response.link)
                return message.channel.send(embed1)
            } else {
                const embed = new MessageEmbed()
                    .setDescription(`Awwww, ${message.member} đã vỗ về ${nguoitag} <3`)
                    .setImage(response.link)
                return message.channel.send(embed)
            }
        });
    }
}