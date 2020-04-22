const SQLite = require('better-sqlite3');
const sql = new SQLite('./data.sqlite');
const {pages} = require('../../functions')
const {MessageEmbed} = require('discord.js')
module.exports = {
    name: "leaderboard",
    aliases: ["bxh"],
    category: "info",
    description: "Xem bảng xếp hạng rank",
    usage: "leaderboard [số trang]",
    example: "leaderboard 2",
    run: async (client, message, args) => {
        const table = sql.prepare("SELECT count(*) FROM sqlite_master WHERE type='table' AND name = 'xpdata';").get();
        if (!table['count(*)']) {
          // If the table isn't there, create it and setup the database correctly.
          sql.prepare("CREATE TABLE xpdata (id TEXT PRIMARY KEY, user TEXT, guild TEXT, xp INTEGER, level INTEGER);").run();
          // Ensure that the "id" row is always unique and indexed.
          sql.prepare("CREATE UNIQUE INDEX idx_xpdata_id ON xpdata (id);").run();
          sql.pragma("synchronous = 1");
          sql.pragma("journal_mode = wal");
        }
        let server_data = sql.prepare("SELECT * FROM xpdata WHERE guild = ? ORDER BY level DESC, xp DESC;").all(message.guild.id);
        server_data = await Promise.all(server_data.map(async (data, index) => {
            const user = await message.guild.members.cache.get(data.user)
            if (user){
                return {
                    tag: user.user.username,
                    level: data.level,
                    rank: index +1,
                    xp: data.xp
                }
            }
        }));
        if (args[0] && isNaN(args[0])) return message.reply('Vui lòng nhập số trang')
        let page = pages(server_data, 10, args[0] || 1);
        if (!page) return message.reply('Trang bạn nhập không tồn tại!')
        let embed = new MessageEmbed()
            .setAuthor(`Bảng xếp hạng | ${message.guild.name}`, message.guild.iconURL())
            .setColor('RANDOM')
            .setDescription(page.map(e => `\`#${e.rank}\` | **${e.tag}** (Level ${e.level}, XP: ${e.xp}/${e.level * 300})`))
        message.channel.send(embed)
    }
}