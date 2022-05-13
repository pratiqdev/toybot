import { catchCommand } from "./catchCommand.js";
import utilities from './utilities.js'

export const handleMessage = (PACK, STATS, message) => {


    if (message.author.bot) return;

    if (message.content.startsWith(PACK.prefix) && message.content.length > PACK.prefix.length) {
        const args = message.content.slice(PACK.prefix.length).split(' ');
        const command = args.shift();

        const config = { ...PACK}
        config.commands = Object.entries(PACK.commands).length
        message.config  = config
        message.utils = utilities
        message.stats = STATS
        message.message = message.content
        message.prefix = PACK.prefix
        message.command = command
        message.args = args

        if(command in PACK.commands && typeof PACK.commands[command] === 'function'){
            STATS.commandsUsed++
            STATS.commands[command]++
            STATS.upTime = Date.now() - STATS.startTime
            catchCommand(PACK, message, PACK.commands[command])
        }

    }
}