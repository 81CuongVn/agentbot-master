var getJSON = require("get-json")
const { MessageEmbed } = require("discord.js")
module.exports = {
    name: "dog",
    category: "animals",
    description: "Gởi ảnh/video về cún",
    run: (client, message, args) => {
        let url = `https://random.dog/woof.json`
        getJSON(url, function(error, response) {
            const embed = new MessageEmbed()
                .setTitle(`Dogs <3`)
                .setURL(response.url)
                .setImage(response.url)
            message.channel.send(embed)
        });

    }
}