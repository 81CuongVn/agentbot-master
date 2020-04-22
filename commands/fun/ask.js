var fs = require('fs')
var array = fs.readFileSync('././ask.txt', 'utf8').split('\r\n')
module.exports = {
    name: "ask",
    category: "fun",
    description: "Trả về câu trả lời đúng, sai hoặc không biết.",
    note: "Hơi gắt xíu D:",
    run: async(client, message, args) => {
        if (!args[0]) return message.reply("Hỏi gì đi chứ bạn :D.")
        const random = array[Math.floor(Math.random() * array.length)];
        return message.reply(random);
    }
}