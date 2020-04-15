const { MessageEmbed } = require("discord.js");
const stringsimilar = require('string-similarity');
const getJSON = require('get-json');
const fs = require('fs');
const ms = require('ms')
const worldometers_url = 'https://viruscoronaapi.herokuapp.com/worldometers'
const wom_url_total = 'https://viruscoronaapi.herokuapp.com/worldometers?data=total'
const vnfull_url = 'https://viruscoronaapi.herokuapp.com/kompa'
const search = {
    "vn": "Vietnam",
    "ca": "Canada",
    "us": "USA",
    "kr": "S. Korea",
    "au": "Australia",
    "cn": "China",
    "se": "Sweden",
    "hk": "Hong Kong",
    "fr": "France"
}
async function getData(){
    //Get total
    getJSON(wom_url_total, function (error, response) {
        if (error) return;
        fs.writeFileSync('././data/total.json', JSON.stringify(response))
    })
    //Get worldometer
    getJSON(worldometers_url, function (error, response){
        if (error) return;
        fs.writeFileSync('././data/worldometers.json', JSON.stringify(response))
    })
    //get full info vietnam
    getJSON(vnfull_url, function (error, response){
        if (error) return;
        fs.writeFileSync('././data/vnfull.json', JSON.stringify(response))
    })
    //lấy tất cả tên tỉnh
    let vnfull_array = []
    let vnfull_data = JSON.parse(fs.readFileSync('././data/vnfull.json'))
    vnfull_data.provinces.forEach(tinhthanh => {
        vnfull_array.push(tinhthanh.Province_Name)
    })
    fs.writeFileSync('././data/provincevnarr.txt', vnfull_array)
}
setInterval(getData, ms('5m'))
module.exports = {
    name: "corona",
    category: "info",
    description: "Thông tin về coronavirus",
    usage: " `_corona` hoặc `_corona <mã quốc gia 2 chữ>`",
    note: "Quốc gia đang hỗ trợ: VN, CA, KR, AU, CN, SE, HK, FR\n Hiện tại có support tìm kiếm bang và quận của mỹ, lệnh là `_corona usprovince <province_name>` và `_corona usstate <state_name>`",
    run: async(client, message, args) => {
        if (!args[0]) {
            var data = JSON.parse(fs.readFileSync('././data/total.json'))
            var confirmed = data.Global_Cases;
            var die = data.Global_Deaths;
            var recovered = data.Global_Recovered;
            const embed = new MessageEmbed()
                .setAuthor(`Dữ liệu được tự động cập nhật`)
                .setTitle(`Thông tin về virus Corona (nCoV, COVID-19)`)
                .addField(`Số lượng ca nhiễm: `, `${confirmed} ca`)
                .addField(`Số người chết: `, `${die} người`)
                .addField(`Số người hội phục: `, `${recovered} người`)
                .setFooter('Nguồn: worldometers.info | Made by phamleduy04#9999');
            message.channel.send(embed);
        } else if (args[0] == 'vn' && args[1]){
            let res = JSON.parse(fs.readFileSync('././data/vnfull.json'))
            let tentinh = args.splice(1).join(' ')
            let tinharr = fs.readFileSync('././data/provincevnarr.txt', 'utf8').split(',')
            if (tentinh.toLowerCase() == 'tphcm' || tentinh.toLowerCase() == 'hcm') tentinh = 'Hồ Chí Minh'
            let matches = stringsimilar.findBestMatch(tentinh, tinharr)
            let res_json = res.provinces.filter(tinhthanh => tinhthanh.Province_Name == matches.bestMatch.target)
            res_json = res_json[0]
            let timestamp = new Date(parseInt(res_json.Last_Update))
            let date_string = timestamp.getDate() + '/' + (timestamp.getMonth() +1) + '/' + timestamp.getFullYear()
            const embed = new MessageEmbed()
                .setAuthor('Dữ liệu được tự động cập nhật')
                .setTitle(`Số ca nghiễm COVID-19 ở ${res_json.Province_Name}`)
                .addField(`Số ca đã xác nhận: `, res_json.Confirmed)
                .addField(`Số ca tử vong: `, res_json.Deaths)
                .addField('Số ca đã hồi phục: ', res_json.Recovered)
                .addField('Ngày cập nhật: ', date_string)
                .setFooter('Nguồn: worldometers.info')
            message.channel.send(embed)
            
        } else if (args[0] == 'usstate' && args[1]){    
            let statename = args.splice(1).join(' ')
            getJSON(`http://corona-js.herokuapp.com/ussearch?state=${statename}`, function(error, response){
                if (error) return message.channel.send('Bot lỗi, vui lòng thử lại sau.')
                if (!response.messages[0].text) return message.channel.send('Bạn phải nhập tên hợp lệ của tiểu bang Hoa Kì.')
                message.channel.send(response.messages[0].text)
            })
        } else if (args[0] == 'usprovince' && args[1]){
            let provincename = args.splice(1).join(' ')
            getJSON(`http://corona-js.herokuapp.com/usprovince?province=${provincename}&lang=vn`, function(error, response){
                if (error) return message.channel.send('Bot lỗi, vui lòng thử lại sau.')
                message.channel.send(response.messages[0].text)
            })
        } else if (args[0] && search[args[0].toLowerCase()]) {
            let res = JSON.parse(fs.readFileSync('././data/worldometers.json'))
            let res_json = res.filter(country => country.Country_Name == search[args[0]])
            res_json = res_json[0]
            const embed = new MessageEmbed()
                .setAuthor('Dữ liệu được tự động cập nhật')
                .setTitle(`Số ca nghiễm COVID-19 ở ${res_json.Country_Name}`)
                .addField(`Số ca đã xác nhận: `, `${res_json.Total_Cases}(${res_json.New_Cases})`)
                .addField(`Số ca tử vong: `, `${res_json.Total_Deaths}(${res_json.New_Deaths})`)
                .addField('Số ca đã hồi phục: ', res_json.Total_Recovered)
                .addField('Số ca nguy kịch ', res_json.Serious_Cases)
                .setFooter('Nguồn: worldometers.info')
            message.channel.send(embed)
        } else {
            message.channel.send(`Đất nước bạn đang tìm kiếm bot chưa hỗ trợ, hãy quay lại sau nhé!`)
        }
    }
}