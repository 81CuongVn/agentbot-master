const {ownerID} = require('../../config.json');
const db = require('quick.db');
module.exports = {
    name: 'disconnect',
    aliases: ['leave'],
    category: 'tts',
    description: 'Để disconnect cho bot',
    usage: 'disconnect',
    VD: 'disconnect',
    run: async(client, message, args) => {
        let voiceChannel = message.member.voice.channel;
        if (message.author.id !== ownerID && !voiceChannel) return message.channel.send('Bạn phải vào voice mới có thể sử dụng lệnh này!')
        if (!voiceChannel.members.get(client.user.id)) return message.channel.send('Bot không ở chung phòng với bạn!')
        await db.set(`${message.guild.id}.botdangnoi`, false)
        await voiceChannel.leave();
        message.react('✅');
    }
}