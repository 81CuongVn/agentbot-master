const Eco = require('quick.eco');
const eco = new Eco.Manager();
const axios = require('axios');
const { MessageEmbed } = require('discord.js');
const instance = axios.create({
    baseURL: 'https://top.gg/api',
    timeout: 10000,
    headers: {
        "Authorization": process.env.TOPGG
    }
})
module.exports = {
    name: "daily",
    category: 'gamble',
    aliases: ['hangngay'],
    description: "Nhận tiền ",
    usage: 'daily',
    note: 'Upvote bot để nhận tiền!',
    run: async (client, message, args) => {
        let res = await instance.get(`/bots/${client.user.id}/check`, {
            params: {
                userId: parseInt(message.author.id)
            }
        })
        res = res.data
        if (res.voted == 0){
            let embed = new MessageEmbed()
                .setTitle('Nhận tiền thất bại!')
                .setDescription(`Bạn chưa upvote cho bot, bạn upvote bằng cách [click vào đây](https://top.gg/bot/645883401500622848/vote)`)
            return message.channel.send(embed)
        } else { //cộng tiền
            let random = Math.floor(Math.random() * 2000)
            await eco.addMoney(message.author.id, random)
            message.channel.send(`:moneybag: Bạn vừa được cộng ${random} tiền!`);
            await instance.post('/addmoney', {
                id: message.author.id
            })
        }
    }
}