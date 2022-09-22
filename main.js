
const { callToApi } = require('./communicator');
const telegram = require('./telegram');
const whatsapp = require('./whatsapp')

const express = require('express');
const app = express();
const cors = require('cors')
const bodyParser = require("body-parser");
require('dotenv').config()

// Call to API
// callToApi('post', '', 'test10000').then(res => {
//     console.log(res.data);
// })
// .catch(err => console.log(err.response))


// initialize Telegram
telegram.telegram()
// initialize Whatsapp
whatsapp.init()

app.options('*', cors())
app.use(cors())

// App
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/whatsapp/status', async (req, res) => {
    let status = await whatsapp.getStatus();
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({status: status}));
    return;

} )

app.get('/telegram/status', async (req, res) => {
    let status = await telegram.getStatus();
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({status: status}));
    return;

});

app.post('/forward-msg', (req, res) => {
    whatsapp.sendWhatsappMsg(req.body.to, req.body.message)
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify({status:"success"}));
    res.end('success');
    return;
});

app.get('/restart', (req, res) => {
    // initialize Telegram
    telegram.telegram()
    // initialize Whatsapp
    whatsapp.init()
    res.end('restarted')
    return;

})

app.listen(process.env.PORT, () => {
    console.log('listening on port ' + process.env.PORT);
});