const { ownerID } = require('../../config.json');
const { inspect } = require('util');
const { stripIndents } = require('common-tags');
const { VultrexHaste } = require('vultrex.haste');
const haste = new VultrexHaste({ url: "https://hasteb.in" });
module.exports = {
        name: "eval",
        aliases: ["e"],
        description: "Execute javascript code",
        usage: "eval <js code>",
        example: "e message.guild",
        run: async(client, message, args) => {
            if (message.author.id == ownerID){
                if (!args[0]) return message.reply('Nhập lệnh để chạy code...')
                try {
                    const start = process.hrtime();
                    let output = eval(args.join(' '));
                    const difference = process.hrtime(start);
                    if (typeof output !== "string") output = inspect(output, {depth: 2});

                    return message.channel.send(stripIndents`
                        *Lệnh đã chạy xong trong ${difference[0] > 0 ? `${difference[0]}s `: ""}${difference[1]/ 1e6}ms*
                        \`\`\`js
                        ${output.length > 1950 ? await haste.post(output) : output} 
                        \`\`\`
                `)
                }
                catch(err) {
                    return message.channel.send(stripIndents`
                        Error:
                        \`${err}\`
                `)
                }
            } else return message.channel.send("Lệnh này chỉ dành cho owner của bot.")
    }
}