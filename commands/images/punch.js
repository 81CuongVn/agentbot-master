const { MessageEmbed } = require("discord.js");
var getJSON = require("get-json");
var { giphy_key } = require("../../config.json")
module.exports = {
    name: "punch",
    category: "images",
    description: "Punch someone :D ",
    usage: "_punch <@tag>",
    run: (client, message, args) => {
        let url = `https://api.giphy.com/v1/gifs/random?api_key=${giphy_key}&tag=punch&rating=R`
        getJSON(url, function(error, response) {
            if (error) return message.reply("Bot lỗi trong khi cố gắng lấy hình, vui lòng thử lại sau")
            let nguoitag = message.mentions.members.array() || message.guild.members.get(args[0])
            if (nguoitag.length == 0) {
                const embed1 = new MessageEmbed()
                    .setDescription(`${message.member} đã tự đấm chính mình 👊`)
                    .setImage(response.data.images.original.url)
                return message.channel.send(embed1)
            } else {
                const embed = new MessageEmbed()
                    .setDescription(`${message.member} đã đấm vỡ mồm 🤜 ${nguoitag}`)
                    .setImage(response.data.images.original.url)
                return message.channel.send(embed)
            }
        });
    }
}