const { MessageEmbed } = require("discord.js");
const weather = require('weather-js');
module.exports = {
    name: "weather",
    category: "info",
    description: "Weather info",
    usage: "weather <query> (zipcode or city)",
    example: "weather Ho Chi Minh",
    run: (client, message, args) => {
        if (!args[0]) return message.channel.send("Vui lòng ghi tên thành phố")
        var query = args.join(' ');
        weather.find({ search: query, degreeType: 'C' }, function(err, result) {
            if (err) return message.channel.send(`Bot lỗi mẹ rồi, thông tin lỗi: ${err}`)
            if (result.length === 0) return message.reply(`Bot không tìm được tên thành phố, vui lòng thử lại.`)
            var current = result[0].current;
            const embed = new MessageEmbed()
                .setDescription(`**${current.skytext}** `)
                .setThumbnail(current.imageUrl)
                .setAuthor(`Thời tiết ở ${current.observationpoint} hôm nay`)
                .addField(`Nhiệt độ: `, `${current.temperature} °C`, true)
                .addField(`Feels like®: `, `${current.feelslike} °C`, true)
                .addField(`Gió: `, current.winddisplay, true)
                .addField(`Độ ẩm: `, `${current.humidity}%`, true)
            return message.channel.send(embed)
        });
    }
}