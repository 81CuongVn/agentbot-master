const random = require('random-number-csprng');
module.exports = {
    name: "random",
    category: "fun",
    description: "Random 1 số từ 1 tới x",
    usage: '_random <x>',
    example: 'random 100 (sẽ random từ 1 tới 100)',
    run: async(client, message, args) => {
        if (!args[0] || isNaN(args[0])) return message.reply('Bạn phải ghi số lớn nhất có thể quay ra!')
        return message.channel.send(`🎲 Số của bạn là: ${await random(0, args[0])}`)
    }
}