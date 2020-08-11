const { ownerID } = require('../../config.json');
module.exports = {
    name: "setnick",
    aliases: ["setnickname"],
    category: "moderation",
    description: "set nickname",
    usage: "setnick <tag> [nickname]",
    note: "nickname bỏ trống = reset nickname",
    example: "setnick @phamleduy04",
    run: async(client, message, args) => {
        if (!message.member.hasPermission('MANAGE_NICKNAMES') && message.author.id !== ownerID) return message.reply("Bạn cần có quyền `\ MANAGE_NICKNAMES `\ để có thể đổi nickname.");
        let user = message.mentions.members.first() || message.guild.members.cache.get(args[0])
        var output = args.slice(1).join(' ')
        if (!args[0]) return message.reply(`Phải tag ai đó chứ`)
        if (!output) var output = user.user.username
        let nickname = args.slice(1).join(' ')
        let status = await user.setNickname(nickname)
            .catch(e => {
                return e
            });
        if (status.code == 50013) return message.channel.send(`Mình không có quyền đổi nickname cho người này!`)
        if (status.message && status.name) return message.channel.send(`Lỗi: ${status.name}, ${status.message}`)
        message.channel.send(`Set nickname thành công cho ${user} thành **${output}**`)
    }
}