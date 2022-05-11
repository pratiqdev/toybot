import utilities from "./utilities.js";

export const handleMessage = (PACK, message) => {

    if (message.author.bot) return;
    if(!PACK.prefix || PACK.prefix === '' || PACK.prefix === '/') return;

    if (message.content.startsWith(PACK.prefix) && message.content.length > PACK.prefix.length) {
        message.utilities = utilities
        message.message = message.content
        message.prefix = PACK.prefix
        const args = message.content.slice(PACK.prefix.length).split(' ');
        const command = args.shift();
        message.command = command
        message.args = args

        if(command in PACK.commands){
            PACK.commands[command](message)
        }

    }
}