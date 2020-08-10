const SQLite = require('better-sqlite3');
const sql = new SQLite('./data.sqlite');
const { pages } = require('../../functions/utils');
const { MessageEmbed } = require('discord.js');
const db = require('quick.db');
module.exports = {
    name: "leaderboard",
    aliases: ["bxh"],
    category: "ranking",
    description: "Xem bảng xếp hạng rank",
    usage: "leaderboard [số trang]",
    note: "Max level là 999",
    example: "leaderboard 2",
    run: async (client, message, args) => {
        const server_prefix = db.get(`${message.guild.id}.prefix`) || "_"
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
                let next_level_xp = data.level * 300
                if (next_level_xp.toString().length >= 4) {
                    next_level_xp = next_level_xp/1000
                    let int_part = Math.trunc(next_level_xp)
                    let float_part = Number((next_level_xp - int_part).toFixed(1));
                    next_level_xp = `${int_part + float_part}K`
                }
                let user_xp = data.xp
                if (user_xp.toString().length >= 4) {
                    user_xp = user_xp/1000
                    let int_part = Math.trunc(user_xp); 
                    let float_part = Number((user_xp-int_part).toFixed(1));
                    user_xp = `${int_part + float_part}K`
                }
                return {
                    tag: user.user.username,
                    level: data.level,
                    rank: index +1,
                    xp: user_xp,
                    next_xp: next_level_xp
                }
            }
        }));
        server_data = server_data.filter(data => data !== undefined)
        if (args[0] && isNaN(args[0])) return message.reply('Vui lòng nhập số trang')
        let page = pages(server_data, 10, args[0] || 1);
        if (!page) return message.reply('Trang bạn nhập không tồn tại!')
        let embed = new MessageEmbed()
            .setAuthor(`Bảng xếp hạng | ${message.guild.name}`, message.guild.iconURL())
            .setColor('RANDOM')
            .setDescription(page.map(e => `\`#${e.rank}\` | **${e.tag}** (Level ${e.level}, XP: ${e.xp}/${e.next_xp})`))
            .setFooter(`Sử dụng lệnh ${server_prefix}bxh <số> để xem các hạng tiếp theo.`)
        message.channel.send(embed)
    }
}