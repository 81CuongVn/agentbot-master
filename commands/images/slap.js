const { MessageEmbed, MessageAttachment } = require("discord.js");
const { readFileSync, readdirSync } = require('fs');
module.exports = {
    name: "slap",
    category: "images",
    description: "Tát ai đó",
    usage: "slap <@tag>",
    run: (client, message, args) => {
        let folder = readdirSync("././assets/slap/");
        let file = readFileSync(`././assets/slap/${folder[Math.floor(Math.random() * folder.length)]}`)
        let attachment = new MessageAttachment(file, 'slap.gif');
        let nguoitag = message.mentions.members.array() || message.guild.members.cache.get(args[0])
        let embed = new MessageEmbed()
            .attachFiles(attachment)
            .setImage('attachment://slap.gif')
        if (nguoitag.length == 0) {
                embed.setDescription(`${message.member} đã tự vả chính mình 🤚`)
        } else {
                embed.setDescription(`${message.member} đã tát vỡ mồm ${nguoitag} 🤚`)
        }
        message.channel.send(embed);
    }
}