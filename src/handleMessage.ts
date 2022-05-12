import utilities from "./utilities.js";
import { catchCommand } from "./catchCommand.js";

export const handleMessage = (PACK, message) => {

    if (message.author.bot) return;
    if(!PACK.prefix || PACK.prefix === '' || PACK.prefix === '/') return;

    if (message.content.startsWith(PACK.prefix) && message.content.length > PACK.prefix.length) {
        const args = message.content.slice(PACK.prefix.length).split(' ');
        const command = args.shift();

        const config = { ...PACK}
        config.commands = Object.entries(PACK.commands).length
        message.config  = config
        message.util = utilities
        message.message = message.content
        message.prefix = PACK.prefix
        message.command = command
        message.args = args

        if(command in PACK.commands && typeof PACK.commands[command] === 'function'){
            catchCommand(PACK, message, PACK.commands[command])
            // PACK.commands[command](message)
        }

    }
}