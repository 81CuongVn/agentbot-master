const { MessageEmbed } = require("discord.js");
var getJSON = require("get-json");
module.exports = {
    name: "hug",
    category: "images",
    description: "Ôm ai đó hoặc tất cả",
    usage: "hug [@tag]",
    example: "hug (ôm tất cả) hoặc hug @phamleduy04",
    run: (client, message, args) => {
        let url = `https://some-random-api.ml/animu/hug`
        let nguoitag = message.mentions.members.array() || message.guild.members.cache.get(args[0])
        getJSON(url, function(error, response) {
            if (!error) {
                if (nguoitag.length == 0) {
                    const embed1 = new MessageEmbed()
                        .setDescription(`${message.member} đã ôm tất cả mọi người <3`)
                        .setImage(response.link)
                    return message.channel.send(embed1)
                }
                const embed = new MessageEmbed()
                    .setDescription(`Awwww, ${message.member} đã ôm ${nguoitag} <3`)
                    .setImage(response.link)
                return message.channel.send(embed)
            } else {
                return message.channel.send("Bot lỗi khi cố gắng lấy hình, hãy thử lại sau")
            }
        });
    }
}

module.exports.limits = {
    rateLimit: 1,
    cooldown: 100
}