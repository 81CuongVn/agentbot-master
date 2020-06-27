const { MessageEmbed } = require('discord.js')
const ms = require('ms')

module.exports = {
    name: "reminder",
    category: "info",
    description: "Đặt lời nhắc",
    usage: "reminder <time> (5s,15m,1h,2d) <text>",
    example: "reminder 1h Đi học",
    run: async(client, message, args) => {
        let reminderTime = args[0]
        if (!reminderTime) return message.reply("Éo ghi thời gian sao tao biết tao nhắc mày.")
        let reminder = args.slice(1).join(" ");
        const embed = new MessageEmbed()
            .setColor("RANDOM")
            .setTitle(`${message.author.username}'s Reminder`)
            .addField("Reminder: ", `${reminder}`)
            .addField("Time", `${reminderTime}`)
            .setTimestamp()
        message.channel.send(embed)

        setTimeout(async function() {
            let embed = new MessageEmbed()
                .setColor("RANDOM")
                .setTitle(`${message.author.username}'s Reminder`)
                .addField("Reminder: ", `${reminder}`)
                .setTimestamp()
            await message.channel.send(`<@${message.author.id}>`)
            message.channel.send(embed)
        }, ms(reminderTime));
    }
}