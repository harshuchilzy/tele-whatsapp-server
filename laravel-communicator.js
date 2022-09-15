require('dotenv').config()

async function api(method, route, data){
    
    var config = {
        method: 'post',
        url: process.env.WHATSAPP_QR_API_END,
        headers: { 
          'Authorization': 'Bearer ' + process.env.LARAVEL_API_TOKEN, 
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        data : data
    };

    await console.log(config);
}

module.exports = { api }