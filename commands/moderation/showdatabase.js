const db = require('quick.db');
const { ownerID } = require('../../config.json');
const SQLite = require('better-sqlite3');
const sql = new SQLite('./data.sqlite');
module.exports = {
    name: "showdatabase",
    aliases: ["showdb", "sdb"],
    note: "Owner bot only",
    run: async (client, message, args) => {
        if (message.author.id !== ownerID) return message.reply('Lệnh này chỉ dành cho owner của bot')
        console.log(db.all())
        console.log('\n\n\n')
        let sqldata = sql.prepare('SELECT * FROM xpdata').get()
        console.log(sqldata)
        message.channel.send('Check your console.')
    }
}