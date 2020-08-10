const array = require('../../assets/thinh.json').data;
module.exports = {
    name: "thinh",
    aliases: ["xinthinh"],
    category: "fun",
    description: "Xin thính",
    usage: "thinh",
    cooldown: 2,
    run: async (client, message, args) => {
        let random = array[Math.floor(Math.random() * array.length)]
        message.channel.send(random)
    }
}