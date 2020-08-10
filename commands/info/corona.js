const { MessageEmbed } = require("discord.js");
const axios = require('axios');
const api = require('novelcovid');
api.settings({baseUrl: 'https://disease.sh'})
const { laysodep } = require('../../functions/utils');
const capitalize = require("capitalize");
const UsaStates = require('usa-states').UsaStates;
module.exports = {
    name: "corona",
    category: "info",
    description: "Thông tin về coronavirus",
    usage: "corona hoặc corona <tên quốc gia>",
    note: "Tìm kiếm bang và quận của mỹ, lệnh là `corona usprovince <province_name,state_code>` và `corona usstate <state_name>`",
    example: "corona usstate texas hoặc corona usprovince dallas,tx",
    run: async(client, message, args) => {
        if (!args[0]) {
            let data = await api.all()
            let d = new Date(data.updated)
            let fulldate = `${d.getDate()}/${d.getMonth()+1}/${d.getFullYear()}`
            let embed = new MessageEmbed()
                .setAuthor('Dữ liệu tự động cập nhật')
                .setTitle(`Số ca nhiễm COVID-19 ở Thế Giới`)
                .addField('Số ca nhiễm: ', `${laysodep(data.cases)}(${laysodep(data.todayCases)})`, true)
                .addField('Số ca tử vong: ', `${laysodep(data.deaths)}(+${laysodep(data.todayDeaths)})`, true)
                .addField('Số ca nghiêm trọng: ',laysodep(data.critical), true)
                .addField('Số ca hồi phục: ', laysodep(data.recovered), true)
                .addField('Số quốc gia bị nhiễm: ', data.affectedCountries, true)
                .addField('Ngày cập nhật: ',fulldate, true)
                .setFooter('Nguồn: worldometers.info')
            message.channel.send(embed)
        } else if (args[0] == 'vncity'){
            if (!args[1]) return message.channel.send('Vui lòng nhập từ khoá cần tìm!')
            let response = await axios.get(`https://corona-js.herokuapp.com/vnsearch?province=${args.splice(1).join(' ')}&lang=vn`)
            if (!response.data.messages) return message.channel.send('Bot lỗi, vui lòng thử lại sau.')
            message.channel.send(response.data.messages[0].text)
        } else if (args[0] == 'usstate'){  
            if (!args[1]) return message.channel.send('Vui lòng nhập tên bang!')
            let statename = args.splice(1).join(' ')
            let data = await api.states({state: statename})
            if (data.message) return message.channel.send('Không tìm thấy bang mà bạn yêu cầu')
            let embed = new MessageEmbed()
                .setAuthor(`Thông tin về COVID-19 ở bang ${data.state}`)
                .addField('Tất cả ca nhiễm: ', `${laysodep(data.cases)}(+${laysodep(data.todayCases)})`, true)
                .addField('Số ca tử vong: ', `${laysodep(data.deaths)}(+${laysodep(data.todayDeaths)})`, true)
                .addField('Số ca đã thử virus: ', laysodep(data.tests),true)
                .addField('Số ca nhiễm hiện tại: ', laysodep(data.active),true)
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
            let data = await api.jhucsse.counties({county: province_name})
            data = data.filter(e => e.province == state)
            data = data[0]
            let d = new Date(data.updatedAt)
            let date = `${d.getDate()}/${d.getMonth()+1}/${d.getFullYear()}`
            let embed = new MessageEmbed()
                .setAuthor(`Thông tin về COVID-19 ở quận ${data.county},${data.province}`)
                .addField('Số ca nhiễm: ', laysodep(data.stats.confirmed) ,true)
                .addField('Số ca tử vong: ', laysodep(data.stats.deaths) ,true)
                .addField('Số ca hồi phục: ',laysodep(data.stats.recovered) ,true)
                .addField('Ngày cập nhật: ', date, true)
                .setFooter('Source: John Hopkins University')
            message.channel.send(embed)
        } else {
            let data = await api.countries({country: args.join(' ')})
            let d = new Date(data.updated)
            let fulldate = `${d.getDate()}/${d.getMonth()+1}/${d.getFullYear()}`
            let embed = new MessageEmbed()
                .setAuthor(`Thông tin về COVID-19 ở ${data.country}`)
                .setThumbnail(data.countryInfo.flag)
                .addField('Số ca nhiễm: ', `${laysodep(data.cases)}(+${laysodep(data.todayCases)})`,true)
                .addField('Số ca tử vong: ', `${laysodep(data.deaths)}(+${laysodep(data.todayDeaths)})`,true)
                .addField('Số ca nghiêm trọng: ', laysodep(data.critical),true)
                .addField('Số ca hồi phục: ', laysodep(data.recovered),true)
                .addField('Ngày cập nhật: ', fulldate, true)
                .setFooter('Nguồn: worldometers.info')
            message.channel.send(embed)
        }
    }
}