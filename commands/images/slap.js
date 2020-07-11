const { MessageEmbed} = require("discord.js");
const getJSON = require("get-json");
const url = 'https://getrandompic.herokuapp.com/randomslap'
module.exports = {
    name: "slap",
    category: "images",
    description: "Tát ai đó",
    usage: "slap <@tag>",
    run: (client, message, args) => {
        getJSON(url, function(error, response){
            if (error) return message.channel.send('Bot lỗi trong khi lấy hình, vui lòng thử lại sau.')
            let nguoitag = message.mentions.members.array() || message.guild.members.cache.get(args[0])
            if (nguoitag.length == 0) {
                const embed1 = new MessageEmbed()
                    .setDescription(`${message.member} đã tự vả chính mình 🤚`)
                    .setImage(response.link)
                return message.channel.send(embed1)
            } else {
                const embed = new MessageEmbed()
                    .setDescription(`${message.member} đã tát vỡ mồm ${nguoitag} 🤚`)
                    .setImage(response.link)
                return message.channel.send(embed)
            }
        })
    }
}