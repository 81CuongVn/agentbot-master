const axios = require('axios');
const { MessageEmbed } = require("discord.js")
module.exports = {
    name: "neko",
    category: "images",
    description: "Gởi ảnh neko ",
    run: async (client, message, args) => {
        try {
            await axios.get('https://nekos.life/api/neko').then(response => {
                const embed = new MessageEmbed()
                    .setTitle('Neko OwO')
                    .setURL(response.data.neko)
                    .setImage(response.data.neko)
                message.channel.send(embed)
            })
        }
        catch(e){
            console.log(e);
            return message.channel.send('Bot lỗi, vui lòng thử lại sau!');
        }
    }
}
