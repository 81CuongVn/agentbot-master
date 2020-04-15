var getJSON = require("get-json");
const { MessageEmbed } = require('discord.js');
module.exports = {
    name: "ping",
    category: "info",
    description: "Returns latency and API ping",
    run: async(client, message, args) => {
        let url = `https://srhpyqt94yxb.statuspage.io/api/v2/components.json`
        getJSON(url, async function(error, response) {
            if (error) return message.channel.send('Bot gặp lỗi trong khi cố gắng kết nối tới Discord')
            const msg = await message.channel.send(`🏓 Pinging....`);
            var api_json = (response.components.filter(find => find.name == "API"))
            var api_json = api_json[0]
            const embed = new MessageEmbed()
                .setDescription(`Độ trễ là: ${Math.floor(msg.createdTimestamp - message.createdTimestamp)}ms`)
                .addField('Discord API status: ', api_json.status, true)
            await msg.delete();
            message.channel.send(embed)
        })
    }
}