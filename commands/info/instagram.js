const { MessageEmbed } = require("discord.js");
const axios = require('axios');
const db = require('quick.db');
const { stripIndent } = require('common-tags'); 
module.exports = {
    name: "instagram",
    aliases: ["insta"],
    category: "info",
    description: "Trả về thông tin cơ bản của tài khoản Instagram",
    usage: "instagram <token>",
    run: async(client, message, args) => {
        if (!args[0]) {
            let embed = new MessageEmbed()
                .setTitle('Click here')
                .setURL('https://archetypethemes.co/pages/instagram-token-generator')
                .setDescription(`Bạn hãy lấy token ở website trên và sử dụng lệnh \`${db.get(`${message.guild.id}.prefix`)}instagram <token-cua-ban>\``)
                .setFooter('Sau khi nhắn tin cho bot hãy xoá tin nhắn đi nhé!')
            return message.channel.send(embed)
        }
        if (message.deletable) message.delete()
        else message.channel.send('Bạn nên xoá tin nhắn của bạn sau khi sử dụng lệnh để bảo mật thông tin!').then(m => m.delete({ timeout: 10000 }))
        await axios.get(`https://api.instagram.com/v1/users/self/?access_token=${args[0]}`).then(response => {
            let data = response.data
            let account = data.data
            let embed = new MessageEmbed()
                .setColor('RANDOM')
                .setTitle(account.full_name)
                .setURL(`https://instagram.com/${account.username}`)
                .setThumbnail(account.profile_picture)
                .addField("Thông tin cá nhân", stripIndent `**- Tên người dùng: ** ${account.username}
            **- Tên đầy đủ:** ${account.full_name}
            **- Giới thiệu:** ${account.bio.length == 0 ? "Không có" : account.bio}
            **- Số bài đăng:** ${account.counts.media}
            **- Followers:** ${account.counts.followed_by}
            **- Following:** ${account.counts.follows}
            **- Website:** ${account.website.length == 0 ? "Không có" : account.website}
            **- Bussiness account?** ${account.is_business ? "Có" : "Không"}`)
                .setFooter(`Instagram ID: ${account.id}`)
            message.channel.send(embed)
        })
        .catch(error => {
            message.channel.send(`Lỗi: ${error.response.data.meta.error_message}`)
        });

    }
}