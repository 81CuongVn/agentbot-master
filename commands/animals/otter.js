const { getunplash } = require('../../functions/utils'); 
module.exports = {
    name: "otter",
    category: "animals",
    description: "Gởi ảnh của rái cá :D",
    run: async (client, message, args) => {
        let embed = await getunplash('otter');
        if (embed === null) return message.channel.send('Bot lỗi, vui lòng thử lại sau!');
        message.channel.send(embed);
    }
}
