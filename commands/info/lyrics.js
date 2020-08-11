const { KSoftClient } = require('ksoft.js');
const { MessageEmbed } = require('discord.js')
const ksoft_key  = process.env.KSOFTKEY;
const ksoft = new KSoftClient(ksoft_key);

module.exports = {
    name: "lyrics",
    aliases: ["lyric"],
    category: "info",
    description: "Tìm lời bài hát",
    usage: "lyrics <tên bài hát>",
    example: "lyrics bad guy",
    run: async(client, message, args) => {
        if (!args[0]) return message.reply("Nhập tên bài hát cần tìm lyrics")
        let song = args.join(' ')
        const respond = await ksoft.lyrics.get(song, false)
            .catch(err => {
                return message.channel.send(err.message)
            });
        let lyrics_length = respond.lyrics.length
        let lyrics = respond.lyrics
        if (lyrics_length > 4095) return message.reply("Lyrics của bài hát bạn đang tìm quá dài để bot có thể xử lý.")
        if (lyrics_length > 2048) {
            let firstembed = new MessageEmbed()
                .setAuthor(`Song: ${respond.name} by ${respond.artist.name}`)
                .setDescription(lyrics.slice(0, 2048))
            let secondembed = new MessageEmbed()
                .setDescription(lyrics.slice(2048, lyrics.length))
            message.channel.send(firstembed)
            message.channel.send(secondembed)
        } else {
            let embed = new MessageEmbed()
                .setAuthor(`Song: ${respond.name} by ${respond.artist.name}`)
                .setDescription(lyrics)
            message.channel.send(embed)
        }
    }
}