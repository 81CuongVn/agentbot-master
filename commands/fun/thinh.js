const fs = require('fs')
const array = fs.readFileSync('./data/thinh.txt', 'utf8').split('\n')
module.exports = {
    name: "thinh",
    aliases: ["xinthinh"],
    category: "fun",
    description: "Xin thính",
    usage: "thinh",
    run: async (client, message, args) => {
        let random = array[Math.floor(Math.random() * array.length)]
        message.channel.send(random)
    }
}

module.exports.limits = {
    rateLimit: 1,
    cooldown: 100
}