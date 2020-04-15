const { MessageEmbed } = require("discord.js");
const { KSoftClient } = require('ksoft.js');
var { ksoft_key } = require('../../config.json')
const ksoft = new KSoftClient(ksoft_key);

module.exports = {
    name: "meme",
    category: "images",
    description: "Sends an epic meme",
    run: async(client, message, args) => {
        const res = await ksoft.images.meme();
        const embed = new MessageEmbed()
            .setTitle(`Meme from ${res.post.subreddit}`)
            .setColor("RANDOM")
            .setImage(res.url)
            .setURL(res.post.link)
            .setFooter(`Upvote: ${res.post.upvotes}. Downvote: ${res.post.downvotes}`)
        message.channel.send(embed);
    }
}