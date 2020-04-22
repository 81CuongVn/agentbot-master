const { Collection, MessageEmbed, Client} = require("discord.js");
const { config } = require("dotenv");
const fs = require("fs");
const SQLite = require('better-sqlite3');
const sql = new SQLite('./data.sqlite');
const client = new Client({
    disableEveryone: true
});
const db = require('quick.db');
client.commands = new Collection();
client.aliases = new Collection();

client.categories = fs.readdirSync("./commands/");

config({
    path: __dirname + "/.env"
});

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
    }, 36e5) //1 hour
    
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

client.on("message", async message => {
    if (message.content.toLowerCase().startsWith('=avatar') == true && message.guild.id == '622939841705017351') return message.reply(`Bạn đã thử sử dụng lệnh \`_avatar\` chưa?`)
    if (message.author.bot) return;
    if (!message.guild) return;
    if (message.guild && db.get(`${message.guild.id}.msgcount`)) {
       let userdata = client.getScore.get(message.author.id, message.guild.id);
      if (!userdata) {
        userdata = { id: `${message.guild.id}-${message.author.id}`, user: message.author.id, guild: message.guild.id, xp: 0, level: 1 }
      }
      let xpAdd = Math.floor(Math.random() * 12) //from 1 to 12
      const nextlvl = userdata.level * 300
      if(userdata.xp > nextlvl) {
        userdata.level++;
        message.reply(`Bạn đã lên cấp **${userdata.level}**!`);
      }
      userdata.xp += xpAdd
      client.setScore.run(userdata);
    }
    //prefix
    if (!db.get(message.guild.id)){
        db.set(message.guild.id, {prefix: "_", logchannel: null, msgcount: true})
    }
    let prefix = db.get(`${message.guild.id}.prefix`)
    
    if (!message.content.startsWith(prefix)) return;
    if (!message.member) message.member = await message.guild.fetchMember(message);

    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    const cmd = args.shift().toLowerCase();

    if (cmd.length === 0) return;

    let command = client.commands.get(cmd);
    if (!command) command = client.commands.get(client.aliases.get(cmd));

    if (command) command.run(client, message, args, prefix);
});
//console chat
let y = process.openStdin()
y.addListener("data", res => {
    let x = res.toString().trim().split(/ +/g)
    let send = x.join(' ')
    if (send.length == 0) return console.log(`Đéo gởi được tin nhắn trống :)`)
    client.channels.get("663966227332333628").send(send);
});
//end console chat
client.login(process.env.TOKEN);