const { MessageEmbed } = require('discord.js');
module.exports = {
    name: "askgoogle",
    category: "fun",
    description: "Trả về link của letmegooglethat",
    run: async(client, message, args, tools) => {
        message.delete()
        if (!args[0]) return message.reply(`**Mày đéo nhập gì tao tìm bằng cu**`)
        let question = encodeURIComponent(args.join(' '));
        let link = `http://letmegooglethat.com/?q=${question}`;
        let embed = new MessageEmbed()
            .setTitle('Câu trả lời của bạn đây')
            .setURL(link)
            .setFooter('Click vào link ở trên')
        message.channel.send(embed)
    }
}