const askdata = require('../../ask.json')
module.exports = {
    name: "ask",
    category: "fun",
    description: "Trả về câu trả lời đúng, sai hoặc không biết.",
    note: "Hơi gắt xíu D:",
    run: async(client, message, args) => {
        let array = askdata.askdb
        if (!args[0]) return message.reply("Hỏi gì đi chứ bạn :D.")
        const random = array[Math.floor(Math.random() * array.length)];
        return message.reply(random);
    }
}