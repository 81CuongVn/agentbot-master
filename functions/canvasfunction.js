const Canvas = require('canvas');
const { join } = require('path');
const { circle, toAbbrev } = require('./utils');
module.exports = {
    welcome: async function welcome(username, discrim, avatarURL, membersize){
        if (!username) throw new Error("No username was provided");
        if (!discrim) throw new Error("No discrim was provided!");
        if (!avatarURL) throw new Error("No avatarURL was provided!");
        if (!membersize) throw new Error("No membersize was provided!");

        Canvas.registerFont(join(__dirname, '..', 'assets', 'font', 'Cadena.ttf'), { family: 'Cadena', weight: "regular", style: "normal" })
        //create canvas
        const canvas = Canvas.createCanvas(700, 250);
        const ctx = canvas.getContext('2d');
    
        const background = await Canvas.loadImage(join(__dirname, '..', 'assets', 'images', 'moscow.png'));
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
    },
    rank: async function(options = {username, discrim, level, rank, neededXP, currentXP, avatarURL, color: '#FFFFFF', background, overlay: true, status: 'online', gradient: []}) {
        if (!options.username) throw new Error('No username was provided!');
        if (!options.level) throw new Error('No level was provided!');
        if (!options.rank) throw new Error('No rank was provided!');
        if (!options.neededXP) throw new Error('No totalXP was provided!');
        if (!options.currentXP) throw new Error('No currentXP was provided!');
        if (!options.avatarURL) throw new Error('No avatarURL was provided!');
        if (!options.color || typeof options.color !== 'string') options.color = '#FFFFFF';
        if (options.overlay !== false) options.overlay = true;
        if (!options.status) options.status = 'online';
        if (
            typeof options.status !== 'string' ||
            !['online', 'offline', 'idle', 'dnd'].includes(options.status.toLowerCase())
        )
            throw new Error('Status must be one of online, idle, dnd or offline.');
        
        const statuses = {
            dnd: join(__dirname, '..', 'assets', 'images', 'dnd.png'),
            idle: join(__dirname, '..', 'assets', 'images', 'idle.png'),
            online: join(__dirname, '..', 'assets', 'images', 'online.png'),
            offline: join(__dirname, '..', 'assets', 'images', 'offline.png')
        };
        let {
            username,
            discrim,
            level,
            rank,
            neededXP,
            currentXP,
            avatarURL,
            color,
            background,
            overlay,
            status,
            gradient
        } = options;

        Canvas.registerFont(join(__dirname, '..', 'assets', 'font', 'regular-font.ttf'), {
            family: 'Manrope',
            weight: 'regular',
            style: 'normal'
        });

        Canvas.registerFont(join(__dirname, '..', 'assets', 'font', 'bold-font.ttf'), {
            family: 'Manrope',
            weight: 'bold',
            style: 'normal'
        });

        Canvas.registerFont(join(__dirname, '..', 'assets', 'font', 'Cadena.ttf'), { family: 'Cadena', weight: "regular", style: "normal" })
        const canvas = Canvas.createCanvas(934, 282);
        const ctx = canvas.getContext('2d');
        let bg;
        let rankCard;
        if ((overlay && typeof background === 'string') || Buffer.isBuffer(background)) {
            bg = await Canvas.loadImage(background);
            ctx.drawImage(bg, 0, 0, canvas.width, canvas.height);
            rankCard = await Canvas.loadImage(join(__dirname, '..', 'assets', 'images', 'rankcard2.png'));
        } else if (!overlay && (typeof background === 'string' || Buffer.isBuffer(background))) {
            bg = await Canvas.loadImage(background);
            ctx.drawImage(bg, 0, 0, canvas.width, canvas.height);
            rankCard = await Canvas.loadImage(join(__dirname, '..', 'assets', 'images', 'rankcard3.png'));
        } else rankCard = await Canvas.loadImage(join(__dirname, '..', 'assets', 'images', 'rankcard.png'));
        ctx.drawImage(rankCard, 0, 0, canvas.width, canvas.height);

        const avatar = await Canvas.loadImage(await circle(avatarURL));
        ctx.drawImage(avatar, 50, 50, 180, 180);
        let i = await Canvas.loadImage(await circle(statuses[status.toLowerCase() || 'online']));
        ctx.drawImage(i, 190, 185, 40, 40);

        const font = 'Manrope';
        let size = 36;
        do {
            size -= 1;
            ctx.font = `bold ${size}px ${font}`
        } while(ctx.measureText(username).width > 350);
        ctx.fillStyle = color || '#FFFFFF';
        ctx.textAlign = 'start';
        ctx.fillText(`${username}#${discrim}`, 260, 164);

        ctx.font = `bold 32px ${font}`;
        ctx.fillStyle = color || '#FFFFFF';
        ctx.textAlign = 'end';
        ctx.fillText(level, 934 - 64, 82);
        ctx.fillStyle = color || '#FFFFFF';
        ctx.fillText('LEVEL', 934 - 64 - ctx.measureText(level).width - 16, 82);

        ctx.font = `bold 32px ${font}`;
        ctx.fillStyle = color || '#FFFFFF';
        ctx.textAlign = 'end';
        ctx.fillText(rank, 934 - 64 - ctx.measureText(level).width - 16 - ctx.measureText(`LEVEL`).width - 16, 82);
        ctx.fillStyle = color || '#FFFFFF';
        ctx.fillText(
            'RANK',
            934 -
                64 -
                ctx.measureText(level).width -
                16 -
                ctx.measureText(`LEVEL`).width -
                16 -
                ctx.measureText(rank).width -
                16,
            82
        );

        ctx.font = `bold 32px ${font}`;
        ctx.fillStyle = color || '#FFFFFF';
        ctx.textAlign = 'start';
        ctx.fillText('/ ' + toAbbrev(neededXP), 690 + ctx.measureText(toAbbrev(currentXP)).width + 15, 164);
        ctx.fillStyle = color || '#FFFFFF';
        ctx.fillText(toAbbrev(currentXP), 690, 164);

        let widthXP = (currentXP * 615) / neededXP;
        if (widthXP > 615 - 18.5) widthXP = 615 - 18.5;

        ctx.beginPath();
        ctx.fillStyle = '#424751';
        ctx.arc(257 + 18.5, 147.5 + 18.5 + 36.25, 18.5, 1.5 * Math.PI, 0.5 * Math.PI, true);
        ctx.fill();
        ctx.fillRect(257 + 18.5, 147.5 + 36.25, 615 - 18.5, 37.5);
        ctx.arc(257 + 615, 147.5 + 18.5 + 36.25, 18.75, 1.5 * Math.PI, 0.5 * Math.PI, false);
        ctx.fill();

        ctx.beginPath();
        if (Array.isArray(gradient) && gradient.length > 0) {
            gradient.length = 2;
            let gradientContext = ctx.createRadialGradient(widthXP, 0, 500, 0);
            gradient.forEach((i) => {
                gradientContext.addColorStop(gradient.indexOf(i), i);
            });
            ctx.fillStyle = gradientContext;
        } else {
            ctx.fillStyle = color;
        }
        ctx.arc(257 + 18.5, 147.5 + 18.5 + 36.25, 18.5, 1.5 * Math.PI, 0.5 * Math.PI, true);
        ctx.fill();
        ctx.fillRect(257 + 18.5, 147.5 + 36.25, widthXP, 37.5);
        ctx.arc(257 + 18.5 + widthXP, 147.5 + 18.5 + 36.25, 18.75, 1.5 * Math.PI, 0.5 * Math.PI, false);
        ctx.fill();

        return canvas.toBuffer();
    }
}