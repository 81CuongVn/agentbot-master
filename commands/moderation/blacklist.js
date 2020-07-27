const db = require('quick.db');
const { ownerID } = require('../../config.json');
module.exports = {
    name: 'blacklist',
    description: 'Blacklist 1 server (owner bot only)',
    usage: 'blacklist <ID server>',
    category: 'moderation',
    run: async (client, message, args) => {
        if (message.author.id !== ownerID) return message.channel.send('Bạn không có quyền sử dụng lệnh này!');
        let serverID = args[0];
        if (!serverID) return message.channel.send('Nhập server ID!');
        // check server
        let server = client.guilds.cache.get(serverID.toString());
        if (!server) return message.channel.send('Server không hợp lệ!')
        let blacklistStatus = await db.get(`${server.id}.blacklist`);
        if (!blacklistStatus) await db.set(`${server.id}.blacklist`, false);
        if (blacklistStatus === true) {
            await db.set(`${server.id}.blacklist`, false);
            message.channel.send(`Đã unblacklist cho server: ${server.name}`)
        } else {
            await db.set(`${server.id}.blacklist`, true);
            message.channel.send(`Đã blacklist server: ${server.name}`)
        }
    }
}