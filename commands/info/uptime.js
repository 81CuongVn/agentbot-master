const prettyMilliseconds = require('pretty-ms');
module.exports = {
    name: 'uptime',
    category: 'info',
    description: 'Bot uptime.',
    usage: 'uptime',
    run: async (client, message, args) => {
        message.channel.send(`Mình đã online được \`${prettyMilliseconds(client.uptime)}\``)
    }
}