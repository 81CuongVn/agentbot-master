const fs = require('fs')
const ss = require('string-similarity')
module.exports = {
    name: "setlogchannel",
    category: "settings",
    description: "Set log channel for kick and ban",
    usage: "setlogchannel <#channel, tên channel hoặc id>",
    VD: "setlogchannel #log-channel",
    run: async(client, message, args) => {
        if (!args[0]) return message.channel.send("Vui lòng nhập channel!")
        let id = args[0]
        if (id.startsWith("<#")) id = id.slice(2, id.length -1)
        let channel = message.guild.channels.cache.get(id)
        if (isNaN(id)){
            let list_channel =  message.guild.channels.cache.filter(c => c.type == 'text').map(channel => channel.name)
            let channel_name = args.join(' ')
            let matches = ss.findBestMatch(channel_name, list_channel)
            if (matches.bestMatch.rating < 0.6) return message.channel.send(`Không tìm thấy channel tên ${channel_name}`)
            channel = message.guild.channels.cache.find(channel => channel.name == matches.bestMatch.target)
        }
        //log to file logchannel.json
        let logchannel_json = JSON.parse(fs.readFileSync('././logchannel.json', 'utf8'))
        if (!logchannel_json[message.guild.id]) {
            logchannel_json[message.guild.id] = {
                channelID: channel.id
            }
        }
        //write file
        fs.writeFileSync('././logchannel.json', JSON.stringify(logchannel_json))
        message.channel.send(`Đã lưu ${channel} vào log channel.`)
    }
}