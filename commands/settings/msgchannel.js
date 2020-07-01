const db = require('quick.db');
const ss = require('string-similarity');
module.exports = {
    name: 'msgchannel',
    category: 'settings',
    description: 'Tắt/Mở phòng tính điểm rank',
    usage: 'msgchannel <#channel>',
    example: 'msgchannel #welcome',
    run: async (client, message, args) => {
        if(!message.member.hasPermission("MANAGE_GUILD")) return message.reply('Bạn cần có quyền MANAGE_GUILD để chạy lệnh này!')
        if (!args[0]) {
            let listChannel = await db.get(`${message.guild.id}.msgChannelOff`);
            if (listChannel.length == 0) return message.channel.send('Server không có phòng nào đang tắt tính exp!')
            let channels = []
            listChannel.forEach(id => {
                let channel = message.guild.channels.cache.get(id);
                if (channel) channels.push(channel);
            })
            return await message.channel.send(`Những phòng đang tắt tính kinh nghiệm là: ${channels.join(' ')}`)
        }
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
        if (!channel) return message.channel.send('Không tìm thấy channel!')
        //check
        let serverChannel = await db.get(`${message.guild.id}.msgChannelOff`);
        if (serverChannel.includes(channel.id)) {
            serverChannel.filter(ch => ch !== channel.id)
            await db.set(`${message.guild.id}.msgChannelOff`, serverChannel)
            message.channel.send(`✅ Đã bật ${channel} thành channel tính kinh nghiệm!`)
        } else {
            //log to database
            await db.push(`${message.guild.id}.msgChannelOff`, channel.id)
            message.channel.send(`✅ Đã tắt ${channel} trong list channel tính kinh nghiệm!`)
        }
    }
}