let stringSimilarity = require('string-similarity')
module.exports = {
    name: "addrole",
    aliases: ["roleadd", "ar"],
    category: "moderation",
    description: "Thêm role",
    usage: "addrole <tag> <rolename>",
    VD: "ar @phamleduy04 DJ",
    run: async(client, message, args) => {
        if (!args[0]) {
            return message.reply("Bạn phải tag ai đó").then(m => m.delete({timeout: 5000}));
        } else if (!message.member.hasPermission('MANAGE_ROLES') || message.author.id !== '455935236262592512') {
            return message.reply("Bạn không có quyền `\ MANAGE_ROLES `\ ")
        } else {
            let roles = message.guild.roles.cache.filter(r => r.managed === false).map(g => g.name)
            var search = args.slice(1).join(' ')
            var matches = stringSimilarity.findBestMatch(search, roles)
            let user = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
            var role = message.guild.roles.cache.find(role => role.name === matches.bestMatch.target);
            if (!user)
                return message.reply("Không tìm thấy người bạn tag, vui lòng thử lại.")
            const error_status = []
            await message.guild.member(user).roles.add(role)
                .catch(err => {
                    message.channel.send(`Lỗi : ${err.message}`);
                    error_status.push(1)
                });
            if (error_status.length == 0) message.channel.send(`✅ Đã add role **${role.name}** cho **${user.user.tag}**!`)
        }
    }
}