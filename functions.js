const random = require('random-number-csprng');
const {MessageEmbed}= require('discord.js');
module.exports = {
    getMember: function(message, toFind = '') {
        toFind = toFind.toLowerCase();

        let target = message.guild.members.cache.get(toFind);

        if (!target && message.mentions.members)
            target = message.mentions.members.first();

        if (!target && toFind) {
            target = message.guild.members.cache.find(member => {
                return member.displayName.toLowerCase().includes(toFind) ||
                    member.user.tag.toLowerCase().includes(toFind)
            });
        }

        if (!target)
            target = message.member;

        return target;
    },

    formatDate: function(date) {
        return new Intl.DateTimeFormat('en-US').format(date)
    },

    promptMessage: async function(message, author, time, validReactions) {
        // We put in the time as seconds, with this it's being transfered to MS
        time *= 1000;

        // For every emoji in the function parameters, react in the good order.
        for (const reaction of validReactions) await message.react(reaction);

        // Only allow reactions from the author, 
        // and the emoji must be in the array we provided.
        const filter = (reaction, user) => validReactions.includes(reaction.emoji.name) && user.id === author.id;

        // And ofcourse, await the reactions
        return message
            .awaitReactions(filter, { max: 1, time: time })
            .then(collected => collected.first() && collected.first().emoji.name);
    },

    pages: function(arr, itemsPerPage, page = 1){
        const maxPages = Math.ceil(arr.length / itemsPerPage);
        if (page < 1 || page > maxPages) return null;
        return arr.slice((page - 1) * itemsPerPage, page * itemsPerPage);
    },

    sleep: function(miliseconds){
        var start = new Date().getTime();
        for (var i = 0; i < 1e7; i++){
            if ((new Date().getTime() - start) > miliseconds){
                break;
            } 
        }
    },
    randomcard: async function(listofcard){
        if (!Array.isArray(listofcard)) return null;
        let num = await random(0, listofcard.length -1)
        let cards = listofcard[num]
        return cards
    },
    checkautowin: function(list){
        let aces = 0;
        let jqk = 0;
        if (list.length !== 2) return {check: false, data: {aces: aces, jqk: jqk}}
        for (let i =0; i<list.length; i++){
            if (!isNaN(list[i].slice(2,3)) && list[i].slice(2,3) !== '1') continue;
            else {
                if (list[i].slice(2,3).toLowerCase() == 'a') aces++;
                else if (list[i].slice(2,3).toLowerCase() == 'j' || list[i].slice(2,3).toLowerCase() == 'q' || list[i].slice(2,3).toLowerCase() == 'k' || list[i].slice(2,3) == '1') jqk++;
            }
        }
        if (aces == 1 && jqk == 1) return {check: true, loaiwin: "xidach", data: {aces: aces, jqk: jqk}}
        else if (aces == 2) return {check: true, loaiwin: "xibang", data: {aces: aces, jqk: jqk}}
        else return {check: false, data: {aces: aces, jqk: jqk}}
    },
    getcardvalue: function(list){
        var point = 0
        var aces = 0
        for (var i=0; i<list.length; i++){
            let cardname = list[i].slice(2,3)
            if (!isNaN(cardname)){
                switch(parseInt(cardname)){
                    case 1:
                        point = point + 10
                        break;
                    default: 
                        point = point + parseInt(cardname)
                        break;
                }
            } else {
                switch(cardname){
                    case "a":
                        aces++
                        break;
                    default:
                        point = point +10
                        break;
                }
            }
        }
        if (aces == 0) return point.toString()
        else {
            for (var y = 0; y<aces; y++){
                if (point > 10) point++;
                else point= point + 11
            }
            return `${point}*` 
        }
    },
    createembed: function(nguoichoi, bet, deck_user, deck_bot ,nguoichoi_val, bot_val, hidden_deck, end){
        let embed = new MessageEmbed()
            .setColor("#00FFFF")
            .setFooter('Game đang diễn ra')
            .setAuthor(`${nguoichoi.tag}, bạn đã cược ${bet} để chơi xì dách!`, nguoichoi.avatarURL())
            .setFooter("Đang chơi!")
        if (end == 'thang'){ //win
            embed.setColor("#90EE90") //light green
            embed.footer.text = `Bạn thắng ${bet} tiền!`
            embed.addFields(
                {name: `Bot: [${bot_val}]`, value: deck_bot},
                {name: `User: [${nguoichoi_val}]`, value: deck_user}
            )
        } else if (end == 'thua'){ //thua
            embed.setColor("#FF0000") //red
            embed.footer.text = `Bạn thua ${bet} tiền!`
            embed.addFields(
                {name: `Bot: [${bot_val}]`, value: deck_bot},
                {name: `User: [${nguoichoi_val}]`, value: deck_user}
            )
        } else if (end == 'hoa') {//hoa
            embed.setColor("#D3D3D3") //light gray
            embed.footer.text = `Bạn không mất tiền cho trận đấu này`
            embed.addFields(
                {name: `Bot: [${bot_val}]`, value: deck_bot},
                {name: `User: [${nguoichoi_val}]`, value: deck_user}
            )
        } else if (end == 'thangx2'){
            embed.setColor("#90EE90")
            embed.footer.text = `Bạn thắng ${parseInt(bet)*2} tiền!`
            embed.addFields(
                {name: `Bot: [${bot_val}]`, value: deck_bot},
                {name: `User: [${nguoichoi_val}]`, value: deck_user}
            )
        } else if (end == 'not'){ //dangchoi
            embed.addFields(
                {name: `Bot: [?]`, value: hidden_deck},
                {name: `User: [${nguoichoi_val}]`, value: deck_user}
            )
        }
        return embed;
    }, laysodep: function(num){
        let pattern = /\B(?=(\d{3})+(?!\d))/g;
        return num.toString().replace(pattern, ',')
    }
}