const { MessageEmbed } = require("discord.js");
const { stripIndents } = require("common-tags");

const fetch = require("node-fetch");

module.exports = {
    name: "instagram",
    aliases: ["insta"],
    category: "info",
    description: "Trả về thông tin cơ bản của tài khoản Instagram",
    usage: "instagram <instagram username>",
    run: async(client, message, args) => {
        const name = args.join(" ");

        if (!name) return message.reply("Bạn phải ghi gì đó để search chứ").then(m => m.delete({timeout: 5000}));


        const url = `https://instagram.com/${name}/?__a=1`;

        let res;

        try {
            res = await fetch(url).then(url => url.json());
        } catch (e) {
            return message.reply("Không tìm thấy account Instagram, bạn hãy kiểm tra lại giúp mình nha")
                .then(m => m.delete({timeout: 5000}));
        }

        const account = res.graphql.user;

        const embed = new MessageEmbed()
            .setColor("RANDOM")
            .setTitle(account.full_name)
            .setURL(`https://instagram.com/${name}`)
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