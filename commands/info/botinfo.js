const { version, license } = require('../../package.json');
const { utc } = require('moment');
const os = require('os');
const { MessageEmbed, version: djsversion} = require('discord.js');
const { formatBytes, laysodep } = require('../../functions/utils');
module.exports = {
    cooldown: 10,
    name: 'botinfo',
    category: 'info',
    description: 'Show info của bot!',
    usage: 'botinfo',
    run: async (client, message, args) => {
        const core = os.cpus()[0]
        const embed = new MessageEmbed()
            .setThumbnail(client.user.displayAvatarURL())
            .setColor(message.guild.me.displayHexColor || 'RANDOM')
            .addField("General", [
                `**--> Tên bot:** ${client.user.tag} (${client.user.id})`,
                `**--> Số lệnh:** ${client.commands.size} lệnh`,
                `**--> Server:** ${laysodep(client.guilds.cache.size)}`,
                `**--> Users:** ${laysodep(client.guilds.cache.reduce((a, b) => a + b.memberCount, 0))}`,
                `**--> Channels:** ${laysodep(client.channels.cache.size)}`,
                `**--> Ngày tạo bot:** ${utc(client.user.createdTimestamp).format('MM/DD/YYYY HH:mm:ss')}`,
                `**--> Node.js version:** ${process.version}`,
                `**--> Bot version: ** v${version}`,
                `**--> Discord.js version:** v${djsversion}`,
                `**--> License:** ${license}`,
                '\u200b'
            ])
            .addField('System', [
                `**--> Platfrom: ** ${process.platform}`,
                `**--> CPU:**`,
                `\u3000 Cores: ${os.cpus().length}`,
                `\u3000 Model: ${core.model}`,
                `\u3000 Speed: ${core.speed}MHz`,
                `**--> Memory:**`,
                `\u3000 Total: ${formatBytes(process.memoryUsage().heapTotal)}`,
                `\u3000 Used: ${formatBytes(process.memoryUsage().heapUsed)}`,
                `**--> Hostname:** ${os.hostname()}`,
            ])
            .setTimestamp()
        message.channel.send(embed)
    }
}