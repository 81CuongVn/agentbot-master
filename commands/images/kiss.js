const { MessageEmbed } = require("discord.js");
const axios = require("axios");
module.exports = {
    name: "kiss",
    category: "images",
    description: "Chụt chụt :D",
    usage: "kiss <@tag>",
    run: async (client, message, args) => {
        try {
            let person = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
            await axios.get(`https://api.giphy.com/v1/gifs/random?api_key=${process.env.GIPHY}&tag=kiss&rating=R`).then(response => {
            if (!person) return message.reply('Tag 1 người nào đi bạn.')
            const embed = new MessageEmbed()
                .setDescription(`${message.member} đã thơm ${person} 💋`)
                .setImage(response.data.data.images.original.url)
                .setFooter(`By AgentBot đẹp trai`)
            return message.channel.send(embed)
            })
        }
        catch(e){
            console.log(e);
            return message.channel.send("Bot lỗi khi cố gắng lấy hình, hãy thử lại sau");
        }
    }
}