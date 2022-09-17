const { default: axios } = require('axios');

require('dotenv').config()
async function callToApi(method, route, data){
    
    var config = {
        method: method,
        url: process.env.CLIENT_URL + route,
        headers: { 
          'Authorization': 'Bearer ' + process.env.CLIENT_API_TOKEN, 
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        data : data
    };

    return new Promise((resolve, reject) => {
      axios(config).then(res => {
        resolve(res)
    })
      .catch(err => reject(err));
    });
    
}

module.exports = { callToApi }