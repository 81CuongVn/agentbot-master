const {ownerID} = require('../../config.json');
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
        await voiceChannel.leave();
        message.react('✅')
    }
}