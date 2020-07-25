const getJSON = require("get-json");
const { MessageEmbed } = require('discord.js');
module.exports = {
    name: 'discordinfo',
    aliases: ['discordstatus', 'status'],
    description: 'Thông tin về server của discord',
    usage: 'status',
    run: async(client, message, args) => {
        let url = `https://srhpyqt94yxb.statuspage.io/api/v2/components.json`
        getJSON(url, async function(error, response) {
            if (error) return message.channel.send('Bot gặp lỗi trong khi cố gắng kết nối tới Discord!');
            const embed = new MessageEmbed()
                .setTitle('Thông tin server của Discord')
                .setTimestamp()
            response.components.forEach(component => {
                embed.addField(component.name, component.status);
            })
            message.channel.send(embed)
        })
    }
}