const Snowshot = require('snowshot');
const window = new Snowshot({
    removeTags: ['script']
});
const { MessageAttachment } = require('discord.js');
const isUrl = require('is-url');
module.exports = {
    name: 'screenshot',
    aliases: ['webshot'],
    category: 'fun',
    description: 'Chụp ảnh của website và gởi vào discord!',
    run: async (client, message, args) => {
        if (!args[0]) return message.channel.send("Vui lòng nhập URL của website!");
        if (!isUrl(args[0])) return message.channel.send("Vui lòng nhập định dạng của website!");
        let msg = await message.channel.send('Đang xử lý ảnh.....')
        window.screenshot(args[0]).then(data => {
            if (msg.deletable) msg.delete()
            let attachment = new MessageAttachment(data, 'website.png');
            return message.channel.send(attachment)
        })
    }
}