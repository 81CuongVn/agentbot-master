const axios = require('axios');
const { MessageEmbed } = require("discord.js");
module.exports = {
    name: "koala",
    category: "animals",
    description: "Gởi ảnh của koala ",
    run: async(client, message, args) => {
        try {
            await axios.get('https://some-random-api.ml/img/koala').then(response => {
                const embed = new MessageEmbed()
                    .setTitle(`Koalaaaa`)
                    .setURL(response.data.link)
                    .setImage(response.data.link)
                    .setFooter(`Click the title to view/download`)
                message.channel.send(embed)
            })
        }
        catch(e){
            console.log(e);
            return message.channel.send('Bot lỗi, vui lòng thử lại sau!');
        }
    }
}