const Discord = require("discord.js")
const { inspect } = require("util")
const ownerid = "455935236262592512"
module.exports = {
        name: "eval",
        aliases: ["e"],
        category: "moderation",
        description: "Execute javascript code",
        usage: "_eval or _e <js code>",
        run: async(client, message, args, tools) => {
                if (message.author.id == ownerid) {
                    let toEval = args.join(" ");
                    let evaluated = inspect(eval(toEval, { depth: 0 }))
                    try {
                        if (toEval) {
                            let hrStart = process.hrtime()
                            let hrDiff;
                            hrDiff = process.hrtime(hrStart)
                            return message.channel.send(`*Thực thi lệnh trong ${hrDiff[0]> 0 ? `${hrDiff[0]}s `: ''}${hrDiff[1] / 1000000}ms.*\`\`\`javascript\n${evaluated}\n\`\`\``,{maxLength:1900}).then(m=>m.delete(10000))

                } else {
                    message.channel.send("Không có lệnh sao tao thực thi.")
                }
            } catch (e){
                message.channel.send(`Lỗi khi đang thực thi lệnh: \`${e.message}\``)
            }
        } else {
            return message.reply("Lệnh này chỉ được sử dụng cho owner của bot").then(m=>m.delete(5000))
        }

    }
}