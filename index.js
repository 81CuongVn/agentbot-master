const { Collection, MessageEmbed, Client, MessageAttachment} = require("discord.js");
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
const client = new Client({
    disableMentions: "everyone"
});
const fetch = require('node-fetch');
const { bid, brainkey } = require('./config.json');
/*
//top.gg API
const DBL = require('dblapi.js');
const dbl = new DBL(process.env.TOPGG, client);

//discord.bots.gg api

const axios = require('axios');
const instance = axios.create({
    baseURL: 'https://discord.bots.gg/api/v1/',
    timeout: 10000,
    headers: {"Authorization": process.env.DBOTGG}
})
*/

const db = require('quick.db');
client.commands = new Collection();
client.aliases = new Collection();
const cooldowns = new Collection();

/*
dbl.on('posted', () => {
    console.log("Server count posted to top.gg")
})

dbl.on('error', e => {
    console.log(e)
})
*/
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

    setInterval(function() {
        client.user.setPresence({
            status: "online",
            activity: {
                name: `Đang phục vụ ${client.guilds.cache.size} servers`,
                type: 'PLAYING'
            }
        });
        /*instance.post(`bots/${client.user.id}/stats`, {
            guildCount: client.guilds.cache.size
        })
        */
    }, 36e5) //1 hour

    /*instance.post(`bots/${client.user.id}/stats`, {
        guildCount: client.guilds.cache.size
    })
    */
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
    let serverdata = db.get(member.guild.id)
    if (!serverdata.welcomechannel) return;
    if (!serverdata.discrim) {
        serverdata.discrim = 'Chào mừng bạn đã vào server!'
        await db.set(member.guild.id, serverdata)
    }
    let image = await welcome(member.user.username, member.user.discriminator, member.user.avatarURL({dynamic: false, format: 'png'}), serverdata.discrim)
    let attachment = new MessageAttachment(image, 'welcome.png')
    let channel = member.guild.channels.cache.get(serverdata.welcomechannel)
    console.log(channel)
    if (!channel) return;
    return channel.send(attachment)
})

client.on("message", async message => {
    if (message.author.bot) return;
    if (!message.guild) return;
    if (message.guild && db.get(`${message.guild.id}.msgcount`) && !cooldown.has(message.author.id)) {
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
        cooldown.add(message.author.id)
        setTimeout(() => {
            cooldown.delete(message.author.id)
        }, ms('1m'))
        }
    }
    //prefix
    if (!db.get(message.guild.id)){
        db.set(message.guild.id, { prefix: "_", logchannel: null, msgcount: true, defaulttts: null, botdangnoi: false, aiChannel: null })
    }
    //ai channel
    let aiChannel = await db.get(`${message.guild.id}.aiChannel`)
    if (!aiChannel) await db.set(`${message.guild.id}.aiChannel`, null) 
    else if (message.channel.id == aiChannel) {
        fetch(`http://api.brainshop.ai/get?bid=${bid}&key=${brainkey}&uid=1&msg=${encodeURIComponent(message.content)}`)
        .then(res => res.json())
        .then(data => {
            message.channel.send(data.cnt)
        })
    }
    const prefixlist = [`<@${client.user.id}>`, `<@!${client.user.id}>`, db.get(`${message.guild.id}.prefix`)]
    let prefix = null;
    for (const thisprefix of prefixlist) {
        if (message.content.toLowerCase().startsWith(thisprefix)) prefix = thisprefix
    }
    if (prefix === null) return;
    if (!message.content.startsWith(prefix)) return;

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
client.login(process.env.TOKEN);

/*
const Canvas = require('canvas');
async function welcome(username, discrim, avatarURL, description){
    if (!username) throw new Error("No username was provided")
    if (!discrim) throw new Error("No discrim was provided!");
    if (!avatarURL) throw new Error("No avatarURL was provided!");
    if (!description) throw new Error("No description was provided!")

    Canvas.registerFont(__dirname + '/assets/Cadena.ttf', {family: 'Cadena', weight: "regular", style: "normal"})
    console.log('register')
    //create canvas
    const canvas = Canvas.createCanvas(700, 250);
    const ctx = canvas.getContext('2d');

    const background = await Canvas.loadImage(__dirname + '/assets/background.png');
    ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
    console.log('background')
    const font = 'Cadena';

    ctx.font = `20px ${font}`;
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'start';
    ctx.shadowBlur = 10;
    ctx.shadowColor = 'black';
    ctx.fillText('Welcome', 260, 100);

    const welcometextPosition = { width: 260, height: 150 };
    console.log('welcome')
    let fontSize = 55;
    ctx.font = `${fontSize}px ${font}`;

    do {
        fontSize -= 1;
        ctx.font = `${fontSize}px ${font}`
    } while (ctx.measureText(`${username}#${discrim}!).width > 430`));

    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'start';
    ctx.fillText(`${username}`, welcometextPosition.width, welcometextPosition.height, 455);
    console.log('start')
    ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.textAlign = 'start';
    ctx.fillText(`#${discrim}!`, ctx.measureText(`${username}`).width + welcometextPosition.width, welcometextPosition.height);
    ctx.shadowBlur = 0;
    ctx.beginPath();
    ctx.arc(125, 125, 100, 0, Math.PI *2, true);
    ctx.closePath();
    ctx.clip();
    console.log('export')
    const avatar = await Canvas.loadImage(avatarURL);
    ctx.drawImage(avatar, 25, 25, 200, 200);
    console.log('return')
    return canvas.toBuffer()
}
*/