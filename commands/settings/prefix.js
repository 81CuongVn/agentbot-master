const { MessageEmbed } = require('discord.js');
const db = require('quick.db');
const { ownerID } = require('../../config.json')
module.exports = {
    name: "prefix",
    category: "settings",
    description: "Đổi prefix của bot",
    usage: `prefix [prefix mới]`,
    note: "Người đổi prefix cần có quyền MANAGE_GUILD!",
    run: async (client, message, args) => {
        if(!message.member.hasPermission("MANAGE_GUILD") && message.author.id !== ownerID) return message.reply('Bạn cần có quyền MANAGE_GUILD để chạy')
        let serverdata = db.get(message.guild.id)
        if (!args[0]) return message.channel.send(`Prefix của server là \`${serverdata.prefix}\``)

        let newprefix = args[0]

        await db.set(`${message.guild.id}.prefix`, newprefix)
        let embed = new MessageEmbed()
            .setColor('RANDOM')
            .setTitle('Đã set prefix!')
            .setDescription(`Prefix mới của bạn là ${newprefix}`)
        message.channel.send(embed)
    }
}