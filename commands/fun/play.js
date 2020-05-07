const db = require('quick.db');
const canrunID = ["455935236262592512", "199276237250625536", "674453963059494931", "106658418722406400"]
const dict = {
    "cammom": "./data/playdata/cam.mp3",
    "huanrose": "./data/playdata/huanrose.mp3",
    "noinang": "./data/playdata/noinang.mp3",
    "ranhcon": "./data/playdata/ranhcon.mp3",
    "sucdekhang": "./data/playdata/sucdekhang.mp3",
    "tobecontinue": "./data/playdata/tobecontinue.mp3",
    "trandan": "./data/playdata/trandan.wav",
    "truylac": "./data/playdata/truylac.mp3"
}
module.exports = {
    name: 'play',
    aliases: ['p'],
    note: 'Lệnh này chỉ cho Saddu, Duy, Wjbu và Ly.',
    run: async(client, message, args) => {
        if (canrunID.indexOf(message.author.id) == -1) return message.channel.send('Bạn không thể sử dụng lệnh này!')
        if (!args[0]) return message.channel.send('Nhập file cần play!')
        let status = await db.get(`${message.guild.id}.botdangnoi`)
        if (status == true) return message.channel.send('Có người khác đang sử dụng bot!')
        let voiceChannel = message.member.voice.channel;
        if (!voiceChannel) return message.reply('Bạn phải vào voice channel để sử dụng lệnh này.')
        let botPremission = voiceChannel.permissionsFor(client.user);
        if (!botPremission.has('CONNECT')) return message.channel.send('Bot không có quyền vào channel này!');
        if (!botPremission.has('SPEAK')) return message.channel.send('Bot không có quyền nói ở channel này!');
        if (args[0] == 'showdict') return message.channel.send(JSON.stringify(dict, null, 4), {code: "json"})
        await db.set(`${message.guild.id}.botdangnoi`, true)
        if (!dict[args[0]]){
            let prefix = await db.get(`${message.guild.id}.prefix`)
            return message.channel.send(`Sử dụng lệnh \`${prefix}play showdict \` để xem tất cả file hiện có`)
        } else {
            voiceChannel.join().then(connection => {
                let dispatcher = connection.play(dict[args[0]])
                dispatcher.on('finish', async () => {
                    await db.set(`${message.guild.id}.botdangnoi`, false)
                })
            })
        }
    }
}