const { MessageEmbed } = require("discord.js")
const fetch = require("node-fetch")
const { stripIndents } = require("common-tags")
const dateFormat = require("dateformat")
var { steam_token } = require('../../config.json')
module.exports = {
    name: "steam",
    category: "info",
    description: "Pull out steam info",
    usage: "steam <custom url name trên steamlink>",
    VD: "steam dacvu008",
    run: async(bot, message, args) => {
        if (!args[0]) return message.channel.send("Hãy nhập tên custom url của bạn.")
        const url = `http://api.steampowered.com/ISteamUser/ResolveVanityURL/v0001/?key=${steam_token}&vanityurl=${args.join(" ")}`;

        fetch(url).then(res => res.json()).then(body => {
            if (body.response.success === 42) return message.channel.send("Mình không tìm thấy tên bạn.")

            const id = body.response.steamid;
            const summaries = `http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=${steam_token}&steamids=${id}`;
            const bans = `http://api.steampowered.com/ISteamUser/GetPlayerBans/v1/?key=${steam_token}&steamids=${id}`;
            const state = ["Offline", "Online", "Busy", "Away", "Snooze", "Looking to trade", "Looking to play"]
            fetch(summaries).then(res => res.json()).then(body => {
                if (!body.response) return message.channel.send("Mình không tìm thấy tên bạn.");
                const { personaname, avatarfull, realname, personastate, loccountrycode, profileurl, timecreated } = body.response.players[0]

                fetch(bans).then(res => res.json()).then(body => {
                    if (!body.players) return message.channel.send("Mình không tìm thấy tên bạn.")
                    const { NumberOfVACBans, NumberOfGameBans } = body.players[0];

                    const embed = new MessageEmbed()
                        .setColor('#00ffff')
                        .setAuthor(`Steam Services | ${personaname}`, avatarfull)
                        .setThumbnail(avatarfull)
                        .setDescription(stripIndents `**Real Name:** ${realname || "Unknown"}
                **Status:** ${state[personastate]}
                **Country:** :flag_${loccountrycode ? loccountrycode.toLowerCase():"white"}:
                **Account Created:** ${dateFormat(timecreated * 1000,"d/mm/yyyy (h:MM:ss TT)")}
                **Bans:** Vac : ${NumberOfVACBans}, Game: ${NumberOfGameBans}
                **Link:** [Link to profile](${profileurl})`)
                        .setTimestamp();

                    message.channel.send(embed)
                })
            })
        })
    }
}