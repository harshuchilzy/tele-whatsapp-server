const qrcode = require('qrcode-terminal');
const { Client, LocalAuth } = require('whatsapp-web.js');
var qs = require('qs');
const axios = require('axios');
const { callToApi } = require('./communicator');

const client = new Client({
    authStrategy: new LocalAuth({ clientId: "client-one" })
});

// callToApi('post', '', 'test1234').then(res => {
//     console.log(res.data);
// }).catch(err => console.log(err.response))

client.on('qr', qr => {
    console.log(qr)
    var data = qs.stringify({
        type: 'qr-code',
        'qr': qr,
    });

    callToApi('post', '/api/whatsapp-webhook' , qs.stringify({
        type: 'qr',
        content: qr
    })).then(res => {
        console.log(res.data);
    }).catch(err => console.log(err.response))
});

client.on('ready', () => {
    console.log('Client is ready!');
    // callToApi('post', process.env.CLIENT_URL + '/whatsapp-webhook' , {type: 'status', content: 'ready'})
    // .then(res => console.log(res.data))
    // .catch(err => console.log(err.response))
});

client.on('disconnected', (reason) => {
    console.log("Logged out");
    // callToApi('post', process.env.CLIENT_URL + '/whatsapp-webhook' , {type: 'status', content: 'disconnected'})
    // .then(res => {console.log(res.data)})
    // .catch(err => console.log(err.response))
});

// client.on('message', message => {
// 	if(message.body === '!ping') {
// 		message.reply('pong');
// 	}
// });

function init(){
    if(client.info == undefined){
        client.initialize();
    }
}

async function getStatus(){
    let status = await client.getState();
    if(status == null){
        return 'check-for-qr'
    }
    return status;
}

async function sendWhatsappMsg(number, message){
    const sanitized_number = number.toString().replace(/[- )(]/g, ""); // remove unnecessary chars from the number
    const final_number = `${sanitized_number.substring(sanitized_number.length - 11)}`;

    const number_details = await client.getNumberId(final_number); // get mobile number details

    if (number_details) {
        const sendMessageData = await client.sendMessage(number_details._serialized, message); // send message
        if(sendMessageData._data){
            return 'Message sent';
        }else{
            return 'Message failed';
        }
    } else {
        return final_number, "Mobile number is not registered";
    }
}

module.exports = { init, getStatus, sendWhatsappMsg }