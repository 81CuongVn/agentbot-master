module.exports = {
    name: "videocall",
    category: "fun",
    description: "Get link video call",
    usage: "videocall",
    note: "Bắt buộc trong voice channel",
    run: (client, message, args) => {
        if (!message.member.voice.channelID) return message.reply('Bạn phải vào 1 voice channel nào đó để sử dụng lệnh này.')
        let link = `http://www.discordapp.com/channels/${message.member.guild.id}/${message.member.voice.channelID}`
        message.channel.send(`Click vào link để vào video call! (Vào voice channel trước nha!)\n Sau đó thì bật camera lên nè :D\n ${link}`, {files: ["././data/videocall.jpg"]})
    }
}