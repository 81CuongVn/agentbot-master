const { readFileSync, readdirSync } = require('fs');
const { MessageAttachment, MessageEmbed } = require('discord.js');
module.exports = {
    name: 'highfive',
    aliases: ['high5'],
    description: 'Đập tay :)',
    usage: 'high5 <@tag>',
    example: 'high5 @phamleduy04',
    run: async (client, message, args) => {
        let emoji = client.emojis.cache.get('741039423080366090');
        if (!emoji) emoji = '🙏';
        let nguoitag = message.mentions.members.array() || message.guild.members.cache.get(args[0]);
        if (nguoitag.length == 0) return message.reply('Tag ai đó đi bạn ơi :(');
        let folder = readdirSync('././assets/highfive/');
        let file = readFileSync(`././assets/highfive/${folder[Math.floor(Math.random() * folder.length)]}`)
        let attachment = new MessageAttachment(file, 'highfive.gif');
        let embed = new MessageEmbed()
            .attachFiles(attachment)
            .setImage('attachment://highfive.gif')
            .setDescription(`${message.member} đã đập tay với ${nguoitag} ${emoji}`)
        message.channel.send(embed);
    }
}