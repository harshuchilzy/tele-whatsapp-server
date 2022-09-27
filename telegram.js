const { TelegramClient, Api } = require("telegram");
const { StoreSession } = require("telegram/sessions");
const input = require("input"); // npm i input
const { callToApi } = require('./communicator');
var qs = require('qs');

const apiId = 19672483;
const apiHash = "b0174da910bcd41bd76bb4633ad2dbf5";
const storeSession = new StoreSession("telegramAuth"); // fill this later with the value from session.save()

const client = new TelegramClient(storeSession, apiId, apiHash, {
    connectionRetries: 5,
});

async function telegram() {
    console.log("Loading interactive connection...");

    // await client.start({
    //     phoneNumber: async () => waitTillResponse('phone-number'),
    //     password: async () => await input.text("Please enter your password: "),
    //     phoneCode: async () => await input.text("Please enter the code you received: "),
    //     onError: (err) => console.log(err)
    // });
    await client.connect();

    let status = await client.checkAuthorization();
    console.log(status)
    if (status == false) {

        await client.signInUserWithQrCode({ apiId, apiHash }, {
            onError: async function (err) {
                console.log(err)
            },
            qrCode: async (code) => {
                callToApi('post', '/api/telegram-webhook', qs.stringify({
                    type: 'qr',
                    qr: code.token.toString('base64url')
                })).catch(err => console.log(err));
                console.log(code.token.toString('base64url'));
                return false;
            },
            password: async (hint) => {
                return "1111";
            }
        })
    }
    console.log("You should now be connected.");
    callToApi('post', '/api/telegram-webhook', qs.stringify({ type: 'telegram-logged-in' }));
    await client.sendMessage("me", { message: "Connected to the system." });

    // New Message Listener
    client.addEventHandler(eventPrint, new TelegramClient.events.NewMessage({}));
};

async function getStatus() {
    let status = await client.checkAuthorization();
    if (status) {
        return 'connected'
    } else {
        return 'not connected'
    }
}

async function eventPrint(event) {
    const message = event.message;

    // console.log(event.message.out)
    if (event.message.out == false) {
        console.log('incoming message')
        console.log(event.message)

        const sender = await message.getSender();
        console.log(sender)
        let forwardTelegram = await callToApi('post', '/api/telegram-webhook', qs.stringify({
            type: 'incoming-telegram',
            content: {
                id: message.id,
                senderId: sender.senderId,
                firstName: sender.firstName,
                lastName: sender.lastName,
                username: sender.username,
                phone: (sender.phone !== undefined) ? sender.phone : sender.username,
                text: message.text
            }
        })).then(res => console.log('OK')).catch(err => console.log(err))
        // console.log(forwardTelegram);
    }
}
module.exports = { telegram, getStatus }