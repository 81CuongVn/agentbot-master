const Eco = require('quick.eco');
const eco = new Eco.Manager();
const { laysodep } = require('../../functions/utils')
module.exports = {
    name: "cash",
    cooldown: 5,
    category: 'gamble',
    aliases: ["balance", "bal"],
    description: "Show tiền!",
    usage: "cash",
    run: async(client, message, args) => {
        let money_emoji = client.emojis.cache.find(e => e.name == "money" && e.guild.id == '702981787139309575');
        let userdata = eco.fetchMoney(message.author.id)
        message.channel.send(`${money_emoji} Bạn đang có **${laysodep(userdata.amount)}** tiền!`)
    }
}