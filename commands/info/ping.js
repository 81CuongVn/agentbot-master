const { MessageEmbed } = require('discord.js');
const publicIP = require('public-ip');
const  ipgeolocation  = process.env.IPGEOLOCATION;
const axios = require('axios');
module.exports = {
    name: "ping",
    category: "info",
    description: "Returns latency and API ping",
    usage: "ping",
    run: async(client, message, args) => {
        const msg = await message.channel.send(`🏓 Pinging....`);
        try {
            let myIP = await publicIP.v4();
            let data = await axios.get(`https://api.ipgeolocation.io/ipgeo?apiKey=${ipgeolocation}&ip=${myIP}`);
            data = data.data;
            await axios.get('https://srhpyqt94yxb.statuspage.io/api/v2/components.json').then(response => {
                let api = response.data.components.filter(el => el.name == "API");
                api = api[0];
                const embed = new MessageEmbed()
                    .addField('Độ trễ (bot):', `${Math.floor(msg.createdTimestamp - message.createdTimestamp)}ms`, true)
                    .addField('Độ trễ (API): ', `${client.ws.ping}ms`, true)
                    .addField('Discord API status: ', api.status, true)
                    .addField('Vị trí hosting: ', `${data.city}, ${data.state_prov}, ${data.country_code2}`, true)
                msg.edit('Pong! 🏓', embed)
            })
        }
        catch(e) {
            console.log(e);
            return msg.edit(`Pong! \`${Math.floor(msg.createdTimestamp - message.createdTimestamp)}ms\``);
        }
    }
}