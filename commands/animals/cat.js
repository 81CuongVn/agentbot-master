const { getunplash } = require('../../functions/utils');
module.exports = {
    name: "cat",
    category: "animals",
    description: "Gởi ảnh/video về moè",
    run: async (client, message, args) => {
        let embed = await getunplash('cat');
        if (embed === null) return message.channel.send('Bot lỗi, vui lòng thử lại sau!');
        message.channel.send(embed);
    }
}