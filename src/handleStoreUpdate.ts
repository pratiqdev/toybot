import utilities from "./utilities.js";
import { catchCommand } from "./catchCommand.js";
import https from 'https'

export const handleStoreUpdate = async (PACK, message) => {

    if (message.author.bot) return;

    if (message.content === `${PACK.prefix}${PACK.title.toLowerCase()}-fill-store`) {


        if(!('attachments' in message && message.attachments instanceof Map)){
            message.reply('Store Fill requires a file attachment')
            return
        }

        const {attachment, name, size, contentType} = Object.values(Object.fromEntries(message.attachments))[0]

        if(!contentType.startsWith('application/json')){
            message.reply('Store Fill requires a json file')
            return
        }


        await message.reply(`Filling ${PACK.title} store with ${name}`)
        
        await utilities.wait(1000)
        
        // let url = "https://www.reddit.com/r/popular.json";

        https.get(attachment,(res) => {
            let body = "";

            res.on("data", (chunk) => {
                body += chunk;
            });

            res.on("end", async () => {
                try {
                    let json = JSON.parse(body);
                    console.log('downloaded json:', json)
                    // do something with JSON
                    // await message.reply(`Downloaded json file`)
                    utilities.store.fillStore(json)

                    let res:any = await utilities.store.getAll()
                    let msg = "New store data sample: \n ```" + JSON.stringify(res.value, null, 2).substring(0,1800) + "```"
                    message.reply(msg)




                } catch (error) {
                    console.error(error.message);
                    await message.reply(`Error downloading json file`)
                };
            });
            
        }).on("error", async (error) => {
            console.error(error.message);
            await message.reply(`Error with https module`)
        });







        // const config = { ...PACK}
        // config.commands = Object.entries(PACK.commands).length
        // message.config  = config
        // message.utils = utilities
        // message.message = message.content
        // message.prefix = PACK.prefix
        // message.command = command
        // message.args = args

        // if(command in PACK.commands && typeof PACK.commands[command] === 'function'){
        //     catchCommand(PACK, message, PACK.commands[command])
        // }

    }

    if (message.content.startsWith(`${PACK.prefix}${PACK.title.toLowerCase()}-set-store`)) {
        const key = message.content.slice(PACK.prefix.length).split(' ')[1]

        if(!key || key.trim() === ''){
            message.reply('Store set requires a key as an argument')
            return
        }


        if(!('attachments' in message && message.attachments instanceof Map)){
            message.reply('Store set requires a file attachment')
            return
        }

        const {attachment, name, size, contentType} = Object.values(Object.fromEntries(message.attachments))[0]

        if(!contentType.startsWith('application/json')){
            message.reply('Store set requires a json file')
            return
        }


        await message.reply(`Setting ${PACK.title} key ${key} with ${name}`)
        
        await utilities.wait(1000)
        
        // let url = "https://www.reddit.com/r/popular.json";

        https.get(attachment,(res) => {
            let body = "";

            res.on("data", (chunk) => {
                body += chunk;
            });

            res.on("end", async () => {
                try {
                    let json = JSON.parse(body);
                    console.log('downloaded json:', json)
                    // do something with JSON
                    // await message.reply(`Downloaded json file`)
                    utilities.store.setStore(key, json)

                    let res:any = await utilities.store.getAll()
                    let msg = "New store data sample: \n ```" + JSON.stringify(res.value, null, 2).substring(0,1800) + "```"
                    message.reply(msg)




                } catch (error) {
                    console.error(error.message);
                    await message.reply(`Error downloading json file`)
                };
            });
            
        }).on("error", async (error) => {
            console.error(error.message);
            await message.reply(`Error with https module`)
        });







        // const config = { ...PACK}
        // config.commands = Object.entries(PACK.commands).length
        // message.config  = config
        // message.utils = utilities
        // message.message = message.content
        // message.prefix = PACK.prefix
        // message.command = command
        // message.args = args

        // if(command in PACK.commands && typeof PACK.commands[command] === 'function'){
        //     catchCommand(PACK, message, PACK.commands[command])
        // }

    }
}