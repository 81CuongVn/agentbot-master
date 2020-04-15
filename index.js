const { Client, Collection } = require("discord.js");
const { config } = require("dotenv");
const fs = require("fs");
const client = new Client({
    disableEveryone: true
});

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

    client.user.setPresence({
        status: "online",
        activity: {
            name: "_help",
            type: "PLAYING"
        }
    });
});

client.on("message", async message => {
    if (message.content.toLowerCase().startsWith('=avatar') == true && message.guild.id == '622939841705017351') return message.reply(`Bạn đã thử sử dụng lệnh \`_avatar\` chưa?`)
    let prefix_file = JSON.parse(fs.readFileSync('./prefix.json', 'utf8'));

    if (!prefix_file[message.guild.id]){
        prefix_file[message.guild.id] = {
            prefix: "_"
        };
        fs.writeFileSync('./prefix.json', JSON.stringify(prefix_file))
    }

    let prefix = prefix_file[message.guild.id].prefix


    //const prefix = "_";
    if (message.author.bot) return;
    if (!message.guild) return;
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