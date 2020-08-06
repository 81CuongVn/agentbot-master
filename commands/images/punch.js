const { MessageEmbed, MessageAttachment } = require("discord.js");
const { readFileSync, readdirSync } = require('fs');
module.exports = {
    name: "punch",
    category: "images",
    description: "Punch someone :D ",
    usage: "punch <@tag>",
    run: (client, message, args) => {
        let folder = readdirSync("././assets/slap");
        let file = readFileSync(`././assets/slap/${folder[Math.floor(Math.random() * folder.length)]}`)
        let attachment = new MessageAttachment(file, 'punch.gif');
        let nguoitag = message.mentions.members.array() || message.guild.members.cache.get(args[0]);
        let embed = new MessageEmbed()
            .attachFiles(attachment)
            .setImage('attachment://punch.gif')
        if (nguoitag.length == 0) {
            embed.setDescription(`${message.member} đã tự đấm chính mình 👊`)
        } else {
            embed.setDescription(`${message.member} đã đấm vỡ mồm ${nguoitag} 👊`)
        }
        message.channel.send(embed);
        
    }
}