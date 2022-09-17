const { TelegramClient } = require("telegram");
const { StoreSession } = require("telegram/sessions");
const input = require("input"); // npm i input
const { callToApi } = require('./communicator');

const apiId = 19672483;
const apiHash = "b0174da910bcd41bd76bb4633ad2dbf5";
const storeSession = new StoreSession("telegramAuth"); // fill this later with the value from session.save()

const client = new TelegramClient(storeSession, apiId, apiHash, {
    connectionRetries: 5,
});

async function telegram() {
    console.log("Loading interactive example...");

    await client.start({
        phoneNumber: async () => await input.text("Please enter your number: "),
        password: async () => await input.text("Please enter your password: "),
        phoneCode: async () =>
            await input.text("Please enter the code you received: "),
        onError: (err) => console.log(err)
    });
    console.log("You should now be connected.");
    
    // Send Authentication to the System
    // callToApi('post', '/telegram-webhook', {
    //     type: 'status',
    //     content: 'success'
    // }).then(res => {
    //     console.log(res.data);
    // })
    // .catch(err => console.log(err.response));
    
    await client.sendMessage("me", { message: "Connected to the system." });

    // New Message Listener
    client.addEventHandler(eventPrint, new TelegramClient.events.NewMessage({}));
};

async function eventPrint(event) {
    console.log('incoming message')
    
    const message = event.message;

    if (event.isPrivate) {
        const sender = await message.getSender();
        // await callToApi('post', '/telegram-webhook', {
        //     type: 'incoming-telegram',
        //     content: {
        //         id: message.id,
        //         senderId: sender.senderId
        //         firstName: sender.firstName,
        //         lastName: sender.lastName,
        //         username: sender.username,
        //         phone: sender.phone,
        //         text: message.text
        //     }
        // }).then(res => console.log(res)).catch(err => console.log(err))
        console.log(sender);
        await client.sendMessage(sender, {
            message: `hi your id is ${message.senderId} and ${sender.firstName} ${sender.lastName}`
        });
    }
}
module.exports = { telegram }