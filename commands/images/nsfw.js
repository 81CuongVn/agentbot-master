const { KSoftClient } = require('ksoft.js');
const { MessageEmbed } = require('discord.js')
const ksoft_key  = process.env.KSOFTKEY;
const ksoft = new KSoftClient(ksoft_key);

module.exports = {
    name: "nsfw",
    category: "images",
    description: "send nsfw images",
    run: async(client, message, args) => {
        if (!message.channel.nsfw) return  message.channel.send("Lệnh này chỉ sử dụng được ở channel có bật mode NSFW!");
        const respond = await ksoft.images.nsfw();
        const embed = new MessageEmbed()
            .setTitle(`Click here to download!`)
            .setDescription(`NSFW image:`)
            .setURL(respond.url)
            .setFooter(`Get by AgentBot`)
            .setImage(respond.url)
        return message.channel.send(embed)
    }
}