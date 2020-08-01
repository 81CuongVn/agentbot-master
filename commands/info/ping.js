var getJSON = require("get-json");
const { MessageEmbed } = require('discord.js');
const publicIP = require('public-ip');
const { ipgeolocation } = require('../../config.json');
const axios = require('axios');
module.exports = {
    name: "ping",
    category: "info",
    description: "Returns latency and API ping",
    usage: "ping",
    run: async(client, message, args) => {
        let myIP = await publicIP.v4();
        let data = await axios.get(`https://api.ipgeolocation.io/ipgeo?apiKey=${ipgeolocation}&ip=${myIP}`);
        data = data.data;
        let url = `https://srhpyqt94yxb.statuspage.io/api/v2/components.json`
        getJSON(url, async function(error, response) {
            if (error) return message.channel.send('Bot gặp lỗi trong khi cố gắng kết nối tới Discord')
            const msg = await message.channel.send(`🏓 Pinging....`);
            var api_json = (response.components.filter(find => find.name == "API"))
            var api_json = api_json[0]
            const embed = new MessageEmbed()
                .setDescription(`Độ trễ là: ${Math.floor(msg.createdTimestamp - message.createdTimestamp)}ms`)
                .addField('Discord API status: ', api_json.status, true)
                .addField('Vị trí hosting: ', `${data.city}, ${data.state_prov}, ${data.country_code2}`)
            await msg.delete();
            message.channel.send(embed)
        })
    }
}