const random = require('random-number-csprng');
const { MessageEmbed }= require('discord.js');
const Canvas = require('canvas');
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
            embed.footer.text = `Bạn thắng ${parseInt(bet.replace(',', ''))*2} tiền!`
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
    }, createembedfield: function(deck){
        if (!Array.isArray(deck)) return null;
        let line = ""
        deck.forEach(card => {
            line+= card
        })
        return line
    },
    locbai : function(listOfCard, deck){
        if (!Array.isArray(listOfCard) || !Array.isArray(deck)) return null;
        return listOfCard.filter(item => !deck.includes(item))
    },
    checkemptyobject: function(obj){
        if (!obj) return true
        for (var key in obj) {
            if (obj.hasOwnProperty(key))
                return false
        }
        return true
    },
    trimArray: function(arr, maxLen) {
        if (arr.length > maxLen) {
            const len = arr.length - maxLen
            arr = arr.slice(0, maxLen);
            arr.push(`${len} more....`);
        }
        return arr;
    },
    formatBytes: function(bytes){
        if (bytes === 0) return '0 Bytes';
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB'];
        const i = Math.floor(Math.log(bytes) / Math.log(1024));
        return `${parseFloat((bytes / Math.pow(1024, i)).toFixed(2))} ${sizes[i]}`
    },
    getIDs: function(cache) {
        let result = "";
        cache.forEach(function(ele, key, map) {
            result += "money_"+key +",";
        });
        return result.slice(0,-1);
    },
    welcome: async function welcome(username, discrim, avatarURL, membersize){
        if (!username) throw new Error("No username was provided");
        if (!discrim) throw new Error("No discrim was provided!");
        if (!avatarURL) throw new Error("No avatarURL was provided!");
        if (!membersize) throw new Error("No membersize was provided!");
    
        Canvas.registerFont(__dirname + '/assets/Cadena.ttf', { family: 'Cadena', weight: "regular", style: "normal" })
        //create canvas
        const canvas = Canvas.createCanvas(700, 250);
        const ctx = canvas.getContext('2d');
    
        const background = await Canvas.loadImage(__dirname + '/assets/moscow.png');
        ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
        const font = 'Cadena';
    
        ctx.font = `30px ${font}`;
        ctx.fillStyle = '#ffffff';
        ctx.textAlign = 'start';
        ctx.shadowBlur = 10;
        ctx.shadowColor = 'black';
        ctx.fillText('Chào mừng', 260, 100);
    
        const welcometextPosition = { width: 260, height: 150 };
        let fontSize = 55;
        ctx.font = `${fontSize}px ${font}`;
    
        do {
            fontSize -= 1;
            ctx.font = `${fontSize}px ${font}`
        } while (ctx.measureText(`${username}#${discrim}!`).width > 430);
    
        ctx.fillStyle = '#ffffff';
        ctx.textAlign = 'start';
        ctx.fillText(`${username}`, welcometextPosition.width, welcometextPosition.height, 455);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
        ctx.textAlign = 'start';
        ctx.fillText(`#${discrim}!`, ctx.measureText(`${username}`).width + welcometextPosition.width, welcometextPosition.height);
        ctx.shadowBlur = 0;
        
        ctx.fillStyle = '#ffffff';
        ctx.textAlign = 'start';
        ctx.font = `29px ${font}`
        ctx.fillText(`Bạn là người thứ ${membersize} của server!`, welcometextPosition.width, welcometextPosition.height + 40)
        ctx.beginPath();
        ctx.arc(125, 125, 100, 0, Math.PI *2, true);
        ctx.closePath();
        ctx.clip();
        const avatar = await Canvas.loadImage(avatarURL);
        ctx.drawImage(avatar, 25, 25, 200, 200);
        
    
        return canvas.toBuffer()
    }
}