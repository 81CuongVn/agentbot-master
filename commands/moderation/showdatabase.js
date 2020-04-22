const db = require('quick.db');
const {ownerID} = require('../../config.json');
module.exports = {
    name: "showdatabase",
    aliases: ["showdb", "sdb"],
    note: "Owner bot only",
    run: async (client, message, args) => {
        if (message.author.id !== ownerID) return message.reply('Lệnh này chỉ dành cho owner của bot')
        console.log(db.all())
        message.channel.send('Check your console.')
    }
}