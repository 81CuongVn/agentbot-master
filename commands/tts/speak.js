const tts =  require('@google-cloud/text-to-speech');
const fs = require('fs');
const util = require('util');
const ttsclient = new tts.TextToSpeechClient();
const { sleep } = require('../../functions/utils');
const lang_list = require('../../assets/ttslang.json');
const db = require('quick.db');
const ms = require('ms');
module.exports = {
    name: 'speak',
    aliases: ['say', 's'],
    category: 'tts',
    description: 'talk',
    usage: 'speak [lang] <text>',
    note: 'lang = en hoặc vi',
    example: 'speak en hello world',
    run: async(client, message, args) => {
        if (db.get(`${message.guild.id}.botdangnoi`) === true) return message.channel.send(`Có người khác đang xài lệnh rồi, vui lòng thử lại sau D:. Nếu bạn nghĩ đây là lỗi, sử dụng lệnh \`${db.get(`${message.guild.id}.prefix`)}fix\` để sửa lỗi!`)
        if (!args[0]) return message.channel.send('Vui lòng nhập gì đó :D.');
        const voiceChannel = message.member.voice.channel;
        if (!voiceChannel) return message.reply('Bạn phải vào voice channel để có thể sử dụng lệnh này.');
        const botpermission = voiceChannel.permissionsFor(client.user);
        if (!botpermission.has('CONNECT')) return message.channel.send('Bot không có quyền vào channel của bạn!');
        if (!botpermission.has('SPEAK')) return message.channel.send('Bot không có quyền nói trong channel của bạn!');
        if (!voiceChannel.joinable) return message.channel.send('Bot không vào được phòng của bạn')
        let text = args.join(' ')
        let lang = await db.get(`${message.guild.id}.defaulttts`)
        if (!lang || lang === null) lang = 'vi-VN'
        if (lang_list[args[0]]) {
            text = args.slice(1).join(' ')
            lang = lang_list[args[0]]
        }
        //create request
        const request = {
            input: {text: text},
            voice: {languageCode: lang, ssmlGender: 'FEMALE'},
            audioConfig: {audioEncoding: 'MP3'},
        };

        const [response] = await ttsclient.synthesizeSpeech(request);
        const writeFile = util.promisify(fs.writeFile);
        await writeFile(`./assets/ttsdata/${message.guild.id}.mp3`, response.audioContent, 'binary');
        //sau khi xử lý xong âm thanh, phát cho người dùng
        let connection;
        try {
            connection = await voiceChannel.join()
        }
        catch(e) {
            return message.channel.send('Bot không thể vào channel của bạn vào lúc này, vui lòng thử lại sau!')
        }
        if (!connection) return message.channel.send('Bot không thể vào channel của bạn vào lúc này, vui lòng thử lại sau!')
        sleep(500);
        let dispatcher = connection.play(`./assets/ttsdata/${message.guild.id}.mp3`)
        await db.set(`${message.guild.id}.botdangnoi`, true)
        await db.set(`${message.guild.id}.endTime`, Date.now() + ms('5m'))
        dispatcher.on('finish', async () => {
            await db.set(`${message.guild.id}.botdangnoi`, false)
            setTimeout(async () => {
                let checkTime = await db.get(`${message.guild.id}.endTime`)
                if (checkTime && Date.now() > checkTime) {
                    await db.delete(`${message.guild.id}.endTime`)
                    connection.disconnect()
                    voiceChannel.leave()
                    message.channel.send('Đã rời phòng vì không hoạt động!')
                }
            }, ms('5m') + 1000)
        })
    }
}