const { Collection, MessageEmbed, Client, Util, MessageAttachment } = require("discord.js");
const { config } = require("dotenv");
config({
    path: __dirname + "/.env"
});
const timerEmoji = '<a:timer:714891786274734120>';
const fs = require("fs");
const SQLite = require('better-sqlite3');
const sql = new SQLite('./data.sqlite');
const ms = require('ms')
const cooldown = new Set();
const client = new Client({disableMentions: "everyone"});
const { timezone } = require('./config.json');
const { BID, BRAINKEY } = process.env
const { welcome } = require('./functions/canvasfunction');
if (!process.env.TYPE_RUN) throw new Error("Chạy lệnh npm run dev hoặc npm run build");

//discord.bots.gg api
const axios = require('axios');
const instance = axios.create({
    baseURL: 'https://discord.bots.gg/api/v1/',
    timeout: 10000,
    headers: {"Authorization": process.env.DBOTGG}
})

if (process.env.TYPE_RUN == 'production') {
    const DBL = require('dblapi.js');
    const dbl = new DBL(process.env.TOPGG, client);
    //top.gg API
    dbl.on('error', e => {
        console.log(e)
    })
}
const db = require('quick.db');
const afkData = new db.table('afkdata');
client.commands = new Collection();
client.aliases = new Collection();
const cooldowns = new Collection();

client.categories = fs.readdirSync("./commands/");


["command"].forEach(handler => {
    require(`./handlers/${handler}`)(client);
});

client.on("ready", () => {
    console.log(`Hi, ${client.user.username} is now online!`);
    //database
    const table = sql.prepare("SELECT count(*) FROM sqlite_master WHERE type='table' AND name = 'xpdata';").get();
    if (!table['count(*)']) {
      // If the table isn't there, create it and setup the database correctly.
      sql.prepare("CREATE TABLE xpdata (id TEXT PRIMARY KEY, user TEXT, guild TEXT, xp INTEGER, level INTEGER);").run();
      // Ensure that the "id" row is always unique and indexed.
      sql.prepare("CREATE UNIQUE INDEX idx_xpdata_id ON xpdata (id);").run();
      sql.pragma("synchronous = 1");
      sql.pragma("journal_mode = wal");
    }
  
    // And then we have two prepared statements to get and set the score data.
    client.getScore = sql.prepare("SELECT * FROM xpdata WHERE user = ? AND guild = ?");
    client.setScore = sql.prepare("INSERT OR REPLACE INTO xpdata (id, user, guild, xp, level) VALUES (@id, @user, @guild, @xp, @level);");
    //set presence
    client.user.setPresence({
        status: "online",
        activity: {
            name: `Đang phục vụ ${client.guilds.cache.size} servers`,
            type: "PLAYING"
        }
    });
    if (process.env.TYPE_RUN == 'production') {
        instance.post(`bots/${client.user.id}/stats`, {
            guildCount: client.guilds.cache.size
        })
        setInterval(function() {
            client.user.setPresence({
                status: "online",
                activity: {
                    name: `Đang phục vụ ${client.guilds.cache.size} servers`,
                    type: 'PLAYING'
                }
            });
            instance.post(`bots/${client.user.id}/stats`, {
                guildCount: client.guilds.cache.size
            })
        }, 36e5) //1 hour
    }
});

client.on("guildCreate", async newguild => { //bot join server
    let embed = new MessageEmbed()
        .setTitle("New Server Joined")
        .addField('Guild Name: ', newguild.name, true)
        .addField('Guild ID: ', newguild.id, true)
        .addField("Guild members: ", newguild.memberCount, true)
        .addField("Owner server: ", newguild.owner.user.tag, true)
        .setFooter(`OwnerID: ${newguild.ownerID}`)
    client.channels.cache.get('700071755146068099').send(embed) //agent's server
})

client.on("guildDelete", async oldguild => { //bot leave server
    let embed = new MessageEmbed()
        .setTitle("Bot left the server!")
        .addField('Guild Name: ', oldguild.name, true)
        .addField('Guild ID: ', oldguild.id, true)
        .addField('Guild members: ', oldguild.memberCount, true)
        .addField("Owner server: ", oldguild.owner.user.tag, true)
        .setFooter(`OwnerID: ${oldguild.ownerID}`)
    client.channels.cache.get('700071755146068099').send(embed) //agent's server
})

client.on('guildMemberAdd', async member => {
    let serverdata = db.get(member.guild.id);
    if (!serverdata.welcomechannel) return;
    let channel = member.guild.channels.cache.get(serverdata.welcomechannel);
    if (!channel) return;
    let image = await welcome(member.user.username, member.user.discriminator, member.user.avatarURL({ format: 'png', dynamic: false }), member.guild.members.cache.size);
    let attachment = new MessageAttachment(image, 'welcome.png');
    return channel.send(attachment);
})

client.on("message", async message => {
    if (message.author.bot) return;
    if (!message.guild) return;
    // prefix
    let serverData = await db.get(message.guild.id);
    if (!serverData){
        serverData = db.set(message.guild.id, { prefix: "_", logchannel: null, msgcount: true, defaulttts: null, botdangnoi: false, aiChannel: null, msgChannelOff: [], blacklist: false })
    }
    if (!db.has(`${message.guild.id}.msgChannelOff`)) await db.set(`${message.guild.id}.msgChannelOff`, [])
    let listChannelMsg = await db.get(`${message.guild.id}.msgChannelOff`);
    if (message.guild && db.get(`${message.guild.id}.msgcount`) && !cooldown.has(message.author.id) && !listChannelMsg.includes(message.channel.id)) {
        let emoji;
        try {
            emoji = Util.parseEmoji(message.content);
        }
        catch(e){}
        if (!emoji || emoji == null || emoji.id == null){
            let userdata = client.getScore.get(message.author.id, message.guild.id);
            if (!userdata) userdata = { id: `${message.guild.id}-${message.author.id}`, user: message.author.id, guild: message.guild.id, xp: 0, level: 1 }
            if (userdata.level !== 999){
            let xpAdd = Math.floor(Math.random() * 12) //from 1 to 12
            const nextlvl = userdata.level * 300
            if(userdata.xp > nextlvl) {
                userdata.level++;
                message.reply(`Bạn đã lên cấp **${userdata.level}**!`);
            }
            userdata.xp += xpAdd
            client.setScore.run(userdata);
            }
        }
        cooldown.add(message.author.id);
            setTimeout(() => {
                cooldown.delete(message.author.id)
        }, ms('1m'))
    }
    //ai channel
    let aiChannel = await db.get(`${message.guild.id}.aiChannel`)
    if (!aiChannel) await db.set(`${message.guild.id}.aiChannel`, null) 
    else if (message.channel.id == aiChannel) {
        await axios.get(`http://api.brainshop.ai/get?bid=${BID}&key=${BRAINKEY}&uid=1&msg=${encodeURIComponent(message.content)}`)
            .then(response => {
                message.channel.send(response.data.cnt);
            })
    }
    let mention = message.mentions.members.array();
    if (mention.length !== 0) {
    mention.forEach(async member => {
        let userAFK = await afkData.get(member.id);
        if (!userAFK) userAFK = await afkData.set(member.id, { afk: false, loinhan: '' })
        if (userAFK.afk === true) message.channel.send(`${member.user.username} đã AFK, lời nhắn: ${userAFK.loinhan}`);
    })
    }   
    const prefixlist = [`<@${client.user.id}>`, `<@!${client.user.id}>`, serverData.prefix]
    let prefix = null;
    for (const thisprefix of prefixlist) {
        if (message.content.toLowerCase().startsWith(thisprefix)) prefix = thisprefix
    }
    if (prefix === null) return;
    if (!message.content.startsWith(prefix)) return;
    let blacklist_status = await db.get(`${message.guild.id}.blacklist`);
    if (!blacklist_status) await db.set(`${message.guild.id}.blacklist`, false);
    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    const cmd = args.shift().toLowerCase();
    if (cmd.length === 0) return;
    let command = client.commands.get(cmd);
    if (!command) command = client.commands.get(client.aliases.get(cmd));
    if (command) {
        if (!cooldowns.has(command.name)) cooldowns.set(command.name, new Collection());
        let now = Date.now()
        let timestamps = cooldowns.get(command.name)
        let cooldownAmount = (command.cooldown || 3) * 1000;
        if (timestamps.has(message.author.id)){
            let expirationTime = timestamps.get(message.author.id) + cooldownAmount;
            if (now < expirationTime){
                let timeLeft = (expirationTime - now)/1000;
                return message.reply(`${timerEmoji} Vui lòng đợi thêm \`${timeLeft.toFixed(1)} giây\` để có thể sử dụng lệnh này.`)
            }
        }
        timestamps.set(message.author.id, now)
        setTimeout(() => timestamps.delete(message.author.id), cooldownAmount)
        if (blacklist_status === true && command.name !== 'blacklist') return message.channel.send('Server bạn đang nằm trong blacklist, vui lòng liên hệ owner của bot hoặc vào support server tại: https://top.gg/bot/645883401500622848');
        logging(`${message.author.tag} đã sử dụng lệnh ${command.name} ở server ${message.guild.name}`);
        command.run(client, message, args);
    }
});

client.on('voiceStateUpdate', (oldstate, newstate) => {
    if (oldstate.member.id !== client.user.id) return;
    if (newstate.channelID == null && (db.get(`${oldstate.guild.id}.botdangnoi`) == true) ){
        db.set(`${oldstate.guild.id}.botdangnoi`, false)
    }
})

client.on('error', (err) => {
    console.log(err)
})

process.on('warning', console.warn);

//console chat
let y = process.openStdin()
y.addListener("data", res => {
    let x = res.toString().trim().split(/ +/g)
    let send = x.join(' ')
    if (send.length == 0) return console.log("Kh gởi được tin nhắn trống :)")
    client.channels.cache.get("702983688811708416").send(send);
});
//end console chat

function logging(content){
    const moment = require('moment-timezone');
    console.log(`${moment.tz(timezone).format("LTS")} || ${content}`);
}

if (process.env.TYPE_RUN == 'ci') process.exit();
client.login(process.env.TOKEN);