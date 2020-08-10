const db = require('quick.db');
const canrunID = ["455935236262592512", "199276237250625536", "621890949244518451", "649875543759781898"]
const dict = require('../../assets/playdatadict.json');
const ms = require('ms');
module.exports = {
    name: 'play',
    aliases: ['p'],
    note: 'Lệnh này chỉ cho Saddu, Duy.',
    run: async(client, message, args) => {
        if (canrunID.indexOf(message.author.id) == -1 && message.guild.id !== "311163013996478464") return message.channel.send('Bạn không thể sử dụng lệnh này!')
        if (!args[0]) return message.channel.send('Nhập file cần play!')
        let status = await db.get(`${message.guild.id}.botdangnoi`)
        if (status == true) return message.channel.send('Có người khác đang sử dụng bot!')
        let voiceChannel = message.member.voice.channel;
        if (!voiceChannel) return message.reply('Bạn phải vào voice channel để sử dụng lệnh này.')
        let botPremission = voiceChannel.permissionsFor(client.user);
        if (!botPremission.has('CONNECT')) return message.channel.send('Bot không có quyền vào channel này!');
        if (!botPremission.has('SPEAK')) return message.channel.send('Bot không có quyền nói ở channel này!');
        if (args[0] == 'showdict') return message.channel.send(JSON.stringify(dict, null, 4), { code: "json" });
        if (!dict[args[0]]){
            let prefix = await db.get(`${message.guild.id}.prefix`);
            return message.channel.send(`Sử dụng lệnh \`${prefix}play showdict \` để xem tất cả file hiện có`);
        } else {
            voiceChannel.join().then(async connection => {
                await db.set(`${message.guild.id}.botdangnoi`, true);
                let dispatcher = connection.play(dict[args[0]])
                await db.set(`${message.guild.id}.endTime`, Date.now() + ms('5m'))
                dispatcher.on('finish', async () => {
                    await db.set(`${message.guild.id}.botdangnoi`, false)
                    setTimeout(async () => {
                        let time = await db.get(`${message.guild.id}.endTime`)
                        if (Date.now() > time){
                            connection.disconnect()
                            voiceChannel.leave()
                            message.channel.send('Đã rời phòng vì không hoạt động!')
                        }
                    }, ms('5m') + 1000)
                })
            })
        }
    }
}