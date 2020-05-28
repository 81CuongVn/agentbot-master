const getJSON = require('get-json');
const uri = require('strict-uri-encode');
const {gggeolocaionkey, timezonedb} = require('../../config.json');
module.exports = {
    name: 'time',
    category: 'info',
    description: 'tìm giờ bằng cách nhập tên TP',
    usage: 'time <nhập địa chỉ, zipcode, hay gì cũng được>',
    VD: 'time Dallas,TX',
    run: async (client, message, args) => {
        if (!args[0]) return message.reply('Ghi tên thành phố hoặc địa chỉ của bạn!.')
        let search = args.join(' ')
        search = uri(search)
        getJSON(`https://maps.googleapis.com/maps/api/geocode/json?address=${search}&key=${gggeolocaionkey}`, function(error, response){
            if (error) return message.channel.send('Bot lỗi, vui lòng thử lại sau!')
            if (response.status == 'ZERO_RESULTS') return message.channel.send('Từ khoá bạn vừa nhập không có trong bản đồ!')
            let res = response.results[0]
            if (res.geometry) {
                let timeurl = `http://api.timezonedb.com/v2.1/get-time-zone?key=${timezonedb}&format=json&by=position&lat=${res.geometry.location.lat}&lng=${res.geometry.location.lng}`
                getJSON(timeurl, function(error, response){
                    if (error) return message.channel.send('Bot lỗi, vui lòng thử lại sau!')
                    message.channel.send(`Múi giờ ${response.zoneName}, ${response.formatted}`)
                })
            }
        })
    }
}

module.exports.limits = {
    rateLimit: 1,
    cooldown: 100
}