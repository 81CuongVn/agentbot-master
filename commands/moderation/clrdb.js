const { ownerID } = require('../../config.json')
const db = require('quick.db');
module.exports = {
    name: "cleardb",
    aliases: ["clrdb"],
    description: "Clear server db",
    note: "Owner bot only!",
    run: async(client, message, args) => {
        if (message.author.id !== ownerID) return message.channel.send('Lệnh này chỉ dành cho owner của bot!')
        let array = db.all()
        array.forEach(e => {
            db.delete(e.ID)
        })
        message.channel.send('Đã xoá hết database của server!')
    }
}