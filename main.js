const qrcode = require('qrcode-terminal');

const express = require('express');
const app = express();
const cors = require('cors')
const bodyParser = require("body-parser");
const axios = require('axios');
var qs = require('qs');
const { Client, LocalAuth } = require('whatsapp-web.js');
app.options('*', cors())
require('dotenv').config()

// console.log(process.env.WHATSAPP_QR_API_END)
// Use the saved values
const client = new Client({
    authStrategy: new LocalAuth({ clientId: "client-one" })
});

client.on('qr', qr => {
    console.log(qr)
    var data = qs.stringify({
        'qr': qr 
    });
    var config = {
        method: 'post',
        url: process.env.WHATSAPP_QR_API_END,
        headers: { 
          'Authorization': 'Bearer ' + process.env.LARAVEL_API_TOKEN, 
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        data : data
    };
      
    axios(config).then(function (response) {
        console.log(JSON.stringify(response.data));
    })
    .catch(function (error) {
        console.log(error);
    });
    // qrcode.generate(qr, {small: true});
});

client.on('ready', () => {
    console.log('Client is ready!');
    // client.logout()
});

client.on('disconnected', (reason) => {
    console.log("Logged out");
});
// client.logout()

client.on('message', message => {
	if(message.body === '!ping') {
		message.reply('pong');
	}
});

client.initialize();

async function sendWhatsappMsg(number, message){
    const sanitized_number = number.toString().replace(/[- )(]/g, ""); // remove unnecessary chars from the number
    const final_number = `94${sanitized_number.substring(sanitized_number.length - 10)}`;

    const number_details = await client.getNumberId(final_number); // get mobile number details

    if (number_details) {
        const sendMessageData = await client.sendMessage(number_details._serialized, message); // send message
    } else {
        console.log(final_number, "Mobile number is not registered");
    }
}

// App
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.post('/forward-msg', (req, res) => {
    sendWhatsappMsg(req.body.to, req.body.message)
    res.end('success');
});
app.listen(process.env.PORT, () => {
    console.log('listening on port ' + process.env.PORT);
});