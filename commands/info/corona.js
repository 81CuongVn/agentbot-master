const { MessageEmbed } = require("discord.js");
const getJSON = require('get-json');
const {NovelCovid} = require('novelcovid');
const ss = require('string-similarity');
const track = new NovelCovid();
const fs = require('fs');
const capitalize = require("capitalize");
const pattern = /\B(?=(\d{3})+(?!\d))/g;
const UsaStates = require('usa-states').UsaStates;
module.exports = {
    name: "corona",
    category: "info",
    description: "Thông tin về coronavirus",
    usage: " `corona` hoặc `corona <tên quốc gia>`",
    note: "Tìm kiếm bang và quận của mỹ, lệnh là `_corona usprovince <province_name,state_code>` và `_corona usstate <state_name>`",
    VD: "corona usstate texas hoặc corona usprovince dallas,tx",
    run: async(client, message, args) => {
        if (!args[0]) {
            let data = await track.all()
            let cases = data.cases.toString().replace(pattern, ",")
            let deaths = data.deaths.toString().replace(pattern, ",")
            let todayCases = data.todayCases.toString().replace(pattern, ",")
            let todayDeaths = data.todayDeaths.toString().replace(pattern, ",")
            let critical = data.critical.toString().replace(pattern, ",")
            let recovered = data.recovered.toString().replace(pattern, ",")
            let d = new Date(data.updated)
            let fulldate = `${d.getDate()}/${d.getMonth()+1}/${d.getFullYear()}`
            let embed = new MessageEmbed()
                .setAuthor('Dữ liệu tự động cập nhật')
                .setTitle(`Số ca nhiễm COVID-19 ở Thế Giới`)
                .addField('Số ca nhiễm: ', `${cases}(+${todayCases})`, true)
                .addField('Số ca tử vong: ', `${deaths}(+${todayDeaths})`, true)
                .addField('Số ca nghiêm trọng: ',critical, true)
                .addField('Số ca hồi phục: ', recovered, true)
                .addField('Số quốc gia bị nhiễm: ', data.affectedCountries, true)
                .addField('Ngày cập nhật: ',fulldate, true)
                .setFooter('Nguồn: worldometers.info')
            message.channel.send(embed)
        } else if (args[0] == 'vncity'){
            if (!args[1]) return message.channel.send('Vui lòng nhập tên thành phố!')
            let province_name = args.slice(1).join(' ')
            let url = `https://corona-js.herokuapp.com/vnsearch?province=${province_name}&lang=vn`
            getJSON(url, function(error, response){
                if (error) return message.channel.send('Bot lỗi khi đang cố gắng lấy dữ liệu, vui lòng thử lại sau.')
                message.channel.send(response.messages[0].text)
            })
        } else if (args[0] == 'usstate'){  
            if (!args[1]) return message.channel.send('Vui lòng nhập tên bang!')
            let statename = args.splice(1).join(' ')
            let data = await track.states()
            let array = fs.readFileSync('././data/usstate.txt', 'utf8').split(',')
            let matches = ss.findBestMatch(statename, array)
            if (matches.bestMatch.rating < 0.2) return message.channel.send('Không tìm thấy bang mà bạn yêu cầu')
            data = data.filter(d => d.state == matches.bestMatch.target)
            data = data[0]
            let cases = data.cases.toString().replace(pattern, ",")
            let deaths = data.deaths.toString().replace(pattern, ",")
            let todayCases = data.todayCases.toString().replace(pattern, ",")
            let todayDeaths = data.todayDeaths.toString().replace(pattern, ",")
            let embed = new MessageEmbed()
                .setAuthor(`Thông tin về COVID-19 ở bang ${data.state}`)
                .addField('Số ca nhiễm: ', `${cases}(+${todayCases})`, true)
                .addField('Số ca tử vong: ', `${deaths}(+${todayDeaths})`, true)
                .addField('Số ca đã thử virus: ')
                .setFooter('Nguồn: worldometers.info')
            message.channel.send(embed)
        } else if (args[0] == 'usprovince'){
            if (!args[1]) return message.channel.send('Vui lòng nhập tên quận!')
            let usState = new UsaStates()
            let usstate_json = usState.states
            let query = args.splice(1).join(' ')
            if (!query.includes(',')) return message.channel.send('Vui lòng nhập tên bang cách tên quận bằng dấu phẩy(,)! (VD: Dallas,tx)')
            let arr_query = query.split(',')
            if (!arr_query[1]) return message.channel.send("Vui lòng nhập tên bang hoặc mã bang!")
            let province_name = arr_query[0].toLowerCase()
            let state = arr_query[1]
            if (state.length == 2) {
                state = state.trim().toUpperCase()
                let dataf = usstate_json.filter(e => e.abbreviation == state)
                dataf = dataf[0]
                state = dataf.name
            }
            state = capitalize.words(state.trim())
            let data = await track.jhucsse(true, province_name)
            data = data.filter(e => e.province == state)
            data = data[0]
            let confirmed = data.stats.confirmed.toString().replace(pattern, ',')
            let deaths = data.stats.deaths.toString().replace(pattern, ',')
            let recovered = data.stats.recovered.toString().replace(pattern, ',')
            let d = new Date(data.updatedAt)
            let date = `${d.getDate()}/${d.getMonth()+1}/${d.getFullYear()}`
            let embed = new MessageEmbed()
                .setAuthor(`Thông tin về COVID-19 ở quận ${data.county},${data.province}`)
                .addField('Số ca nhiễm: ', confirmed,true)
                .addField('Số ca tử vong: ', deaths,true)
                .addField('Số ca hồi phục: ',recovered,true)
                .addField('Ngày cập nhật: ', date,true)
                .setFooter('Source: John Hopkins University')
            message.channel.send(embed)
        } else {
            let data = await track.countries(args.join(' '))
            let cases = data.cases.toString().replace(pattern, ",")
            let deaths = data.deaths.toString().replace(pattern, ",")
            let todayCases = data.todayCases.toString().replace(pattern, ",")
            let todayDeaths = data.todayDeaths.toString().replace(pattern, ",")
            let critical = data.critical.toString().replace(pattern, ",")
            let recovered = data.recovered.toString().replace(pattern, ",")
            let d = new Date(data.updated)
            let fulldate = `${d.getDate()}/${d.getMonth()+1}/${d.getFullYear()}`
            let embed = new MessageEmbed()
                .setAuthor(`Thông tin về COVID-19 ở ${data.country}`)
                .setThumbnail(data.countryInfo.flag)
                .addField('Số ca nhiễm: ', `${cases}(+${todayCases})`,true)
                .addField('Số ca tử vong: ', `${deaths}(+${todayDeaths})`,true)
                .addField('Số ca nghiêm trọng: ', critical,true)
                .addField('Số ca hồi phục: ', recovered,true)
                .addField('Ngày cập nhật: ', fulldate, true)
                .setFooter('Nguồn: worldometers.info')
            message.channel.send(embed)
        }
    }
}