const api = require('novelcovid');
api.settings({baseUrl: 'https://disease.sh'})
const { CanvasRenderService } = require('chartjs-node-canvas')
const moment = require('moment');
const formatNumber = number => String(number).replace(/(.)(?=(\d{3})+$)/g,'$1,');
const {MessageEmbed, MessageAttachment} = require('discord.js')
module.exports = {
    name: 'coronagraph',
    aliases: ['cgraph'],
    description: 'Graph corona stuff',
    usage: 'coronagraph <country name or country code>',
    VD: 'coronagraph us',
    run: async (client, message, args) => {
        const setup = (ChartJS) => {
            ChartJS.defaults.global.defaultFontColor='#fff'
            ChartJS.defaults.global.defaultFontStyle='bold'
            ChartJS.defaults.global.defaultFontFamily='Helvetica Neue, Helvetica, Arial, sans-serif'
            ChartJS.plugins.register({
              beforeInit: function(chart){
                chart.legend.afterFit = function() { this.height += 35 }
              },
              beforeDraw: (chart) => {
                const ctx = chart.ctx;
                ctx.save();
                ctx.fillStyle = '#2F3136';
                ctx.fillRect(0, 0, chart.width, chart.height);
                ctx.restore();
              }
            })
          }
        const lineRenderer = new CanvasRenderService(1200, 600, setup);
        const createEmbed = (opts, embed) => new MessageEmbed(embed)
            .setTitle(opts.title || '')
            .setAuthor(opts.author && opts.author.name || '', opts.author && opts.author.url || '')
            .setDescription(opts.description || '')
            .setThumbnail(opts.thumbnail)
            .setColor(opts.color)
            .attachFiles(opts.files || [])
            .addFields(opts.fields || [])
            .setImage(opts.image || '')
            .setURL(opts.url)
            .setTimestamp()
            .setFooter(opts.footer || '')
        if (!args[0]) return message.channel.send('Vui lòng nhập tên nước!');
        const data = ['global', 'all'].includes(args[0].toLowerCase()) ? {timeline: await api.historical.all({days: -1})} : await api.historical.countries({country: args[0] ,days: -1})
        if (data.message) return message.channel.send(`Không tìm thấy ${args[0]} hoặc khu vực bạn tìm không có ca nhiễm.`);
        const datasets = [{
            label: 'Cases',
            borderColor: '#ffffff',
            pointBackGroundColor: '#ffffff',
            pointRadius: 2,
            borderWidth: 3,
            data: Object.values(data.timeline.cases)
        },{
            label: "Deaths",
            borderColor: '#E26363',
            pointBackgroundColor: '#E26363',
            pointRadius: 2,
            borderWidth: 3,
            data: Object.values(data.timeline.deaths)
        },{
            label: "Recovered",
            borderColor: '#74D99F',
            pointBackgroundColor: '#74D99F',
            pointRadius: 2,
            borderWidth: 3,
            data: Object.values(data.timeline.recovered)
        }]
        for (const index in datasets)
            if (datasets[index].data.filter(x => x).length === 0 ) datasets.splice(index, 1)
        const buffer = await lineRenderer.renderToBuffer({
            type: 'line',
            data: {
                labels: Object.keys(data.timeline.cases),
                datasets
            },
            options: {
                scales: {
                    xAxes: [{
                        display: true,
                        ticks: {
                            fontSize: 17.5,
                            callback: (label) => moment(label, 'M/D/YY').format('DD MMM'),
                            padding: 10
                        },
                        gridLines: {
                            zeroLineColor: '#fff',
                            zeroLineWidth: 2
                        }
                    }],
                    yAxes: [{
                        display: true,
                        type: args[1] === 'log' ? 'logarithmic': 'linear',
                        ticks: {
                            fontSize: 17.5,
                            callback: formatNumber
                        },
                        gridLines: {
                            zeroLineColor: '#fff',
                            zeroLineWidth: 2
                        }
                    }]
                },
                legend: {
                    display: true,
                    labels: {
                        usePointStyle: true,
                        padding: 40,
                        fontSize: 30
                    }
                }
            }
        })
        const embed = createEmbed({
            color: '#303136',
            author: {name: 'COVID Stats'},
            title: `${data.country || 'Global'} Timeline`,
            description: 'Nguồn: John Hopkins University',
            files: [new MessageAttachment(buffer, 'graph.png')],
            image: 'attachment://graph.png'
        })
        await message.channel.send(embed)
    }
}

module.exports.limits = {
    rateLimit: 1,
    cooldown: 100
}