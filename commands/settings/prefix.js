const Discord = require('discord.js')
const fs = require('fs')

module.exports = {
    name: "prefix",
    category: "settings",
    description: "Đổi prefix của bot",
    usage: `prefix <prefix mới>`,
    note: "Người đổi prefix cần có quyền MANAGE_SERVER!",
    run: async (client, message, args) => {
        if(!message.member.hasPermission("MANAGE_SERVER")) return message.reply('Bạn cần có quyền MANAGE_SERVER để chạy')
        if (!args[0]) return message.reply('Bạn cần ')
        let prefix_file = JSON.parse(fs.readFileSync('./prefix.json', 'utf8'));

        prefix_file[message.guild.id] = {
            prefix: args[0]
        };

        fs.writeFile('./prefix.json', JSON.stringify(prefix_file), (err) => {
            if (err) console.log(err)
        })

        let embed = new Discord.MessageEmbed()
            .setColor('RANDOM')
            .setTitle('Đã set prefix!')
            .setDescription(`Prefix mới của bạn là ${args[0]}`)
        message.channel.send(embed)
    }
}