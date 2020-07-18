const db = require('quick.db');
const lang_list = {
    "en": "en-US",
    "vi": "vi-VN"
}
module.exports = {
    name: "setdefault",
    category: 'tts',
    aliases: ["setdef"],
    description: "Set default tts lang for tts command",
    usage: "setdefault <en or vi>",
    example: "setdefault en",
    run: async(client, message, args) => {
        if(!args[0]){
            let defaulttts = await db.get(`${message.guild.id}.defaulttts`)
            if (!defaulttts || defaulttts === null) return message.channel.send('Giọng text to speech của bạn là \`vi-VN\`')
            message.channel.send(`Ngôn ngữ của bạn là: ${lang_list[defaulttts]}`) 
        }
        else if (!lang_list[args[0]]) return message.channel.send('Bạn phải nhập `\ en \` hoặc \` vi \` để set ngôn ngữ mặc định.')
        else if (lang_list[args[0]]) {
            await db.set(`${message.guild.id}.defaulttts`, lang_list[args[0]])
            message.channel.send(`Đã set ngôn ngữ mặc định của lệnh tts là: \`${lang_list[args[0]]}\``)
        }
    }
}