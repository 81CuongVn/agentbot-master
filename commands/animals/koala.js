var getJSON = require("get-json")
const { MessageEmbed } = require("discord.js")
module.exports = {
    name: "koala",
    category: "animals",
    description: "Gởi ảnh của koala ",
    run: async(client, message, args) => {
        let url = `https://some-random-api.ml/img/koala`
        getJSON(url, function(error, response) {
            const embed = new MessageEmbed()
                .setTitle(`Koalaaaa`)
                .setURL(response.link)
                .setImage(response.link)
                .setFooter(`Click the title to view/download`)
            message.channel.send(embed)
        });

    }
}