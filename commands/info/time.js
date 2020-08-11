const axios = require('axios');
const gggeolocaionkey = process.env.GEOLOCATION;
const timezonedb = process.env.TIMEZONEDB;
module.exports = {
    name: 'time',
    category: 'info',
    description: 'tìm giờ bằng cách nhập tên TP',
    usage: 'time <nhập địa chỉ, zipcode, hay gì cũng được>',
    example: 'time Dallas,TX',
    run: async (client, message, args) => {
        if (!args[0]) return message.reply('Ghi tên thành phố hoặc địa chỉ của bạn!.')
        let search = encodeURIComponent(args.join(' '));
        try {
            let googleData = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${search}&key=${gggeolocaionkey}`);
            googleData = googleData.data;
            if (googleData.status == 'ZERO_RESULTS') return message.channel.send('Từ khoá bạn vừa nhập không có trong bản đồ!');
            if (googleData.status == 'REQUEST_DENIED') throw new Error('Cần thay đổi API KEY của ggeolocation!')
            googleData = googleData.results[0]
            if (googleData.geometry) {
                let geo = googleData.geometry
                let timedb = await axios.get(`http://api.timezonedb.com/v2.1/get-time-zone?key=${timezonedb}&format=json&by=position&lat=${geo.location.lat}&lng=${geo.location.lng}`);
                timedb = timedb.data;
                message.channel.send(`Múi giờ ${timedb.zoneName}, ${timedb.formatted}`)
            }
        }
        catch(e) {
            console.log(e);
            message.channel.send('Bot lỗi khi đang cố gắng truy xuất dữ liệu, vui lòng thử lại sau!')
        }
    }
}