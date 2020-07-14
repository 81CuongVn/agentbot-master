const { MessageEmbed } = require("discord.js");
const axios = require('axios');
const { stripIndents } = require('common-tags'); 
module.exports = {
    name: "instagram",
    aliases: ["insta"],
    category: "info",
    description: "Trả về thông tin cơ bản của tài khoản Instagram",
    usage: "instagram <token>",
    run: async(client, message, args) => {
        if (!args[0]) return message.channel.send('Bạn vui lòng nhập instagram của bạn!');
        const instagram = args.join(' ');
        const url = `https://instagram.com/${instagram}/?__a=1`;
        let res;
        try {
            res = await axios.get(url, {headers: {cookie: process.env.INSTAGRAM_COOKIE}})
        } catch(e) {
            return message.channel.send('Mình không tìm thấy tên instagram của bạn!')
        }
        const account = res.data.graphql.user;
        const embed = new MessageEmbed()
            .setColor("RANDOM")
            .setTitle(account.full_name)
            .setURL(`https://instagram.com/${instagram}`)
            .setThumbnail(account.profile_pic_url_hd)
            .addField("Thông tin cá nhân", stripIndents `**- Tên người dùng:** ${account.username}
            **- Tên đầy đủ:** ${account.full_name}
            **- Bio:** ${account.biography.length == 0 ? "Không có" : account.biography}
            **- Số bài đăng:** ${account.edge_owner_to_timeline_media.count}
            **- Followers:** ${account.edge_followed_by.count}
            **- Following:** ${account.edge_follow.count}
            **- Private?:** ${account.is_private ? "Có 🔐" : "Không 🔓"}`);

        message.channel.send(embed);
    }
}