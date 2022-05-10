import log, {WARNING, FATAL, LOG, DOCUMENTATION_LINK} from './logItems.js'

export const prepPackConfig = (PACK:any) => {
    if(!process.env.BOT_TOKEN){
        FATAL(
            `Discord requires a "bot token" to interact with its API`,
            '',
            'This token should be set as an env var (BOT_TOKEN = xxxx)',
            `Be sure to add this token to .gitignore / .npmignore to prevent`,
            `unauthorized users from using this token`
        )
    }
    
    else if(!PACK || Object.entries(PACK).length === 0){
        FATAL(
            `No config object was provided`,
            '',
            'A valid config object is required to setup commands.',
            '',
            `config = {`,
            `   guild:    '1234'`,
            `   client:   '4567'`,
            `   prefix:   '!!!'`,
            `   commands: [`,
            `     ...`,
            `   ]`,
            `}`,
            '',
            'View the documentation for examples of the config object',
            DOCUMENTATION_LINK,
        )
    }
    
    else if(!PACK.client){
        FATAL(
            `No client id (client) was provided`,
            '',
            'A valid config object is required to setup commands.',
            '',
            `config = {`,
            `   guild:    '1234'`,
            `   client:   '4567'`,
            `   commands: [`,
            `     ...`,
            `   ]`,
            `}`,
            '',
            'View the documentation for examples of the config object',
            DOCUMENTATION_LINK,
        )
    }
    
    else if(!PACK.guild){
        FATAL(
            `No guild id (guild) was provided`,
            '',
            'A valid config object is required to setup commands.',
            '',
            `config = {`,
            `   guild:    '1234'`,
            `   client:   '4567'`,
            `   commands: [`,
            `     ...`,
            `   ]`,
            `}`,
            '',
            'View the documentation for examples of the config object',
            DOCUMENTATION_LINK,
        )
    }
    else{
        LOG(
            `| CLIENT:   ${PACK.client}`,
            `| GUILD:    ${PACK.guild}`,
            PACK.prefix ? `| PREFIX:   ${PACK.prefix}` : ``,
            `| COMMANDS: ${PACK.commands.length}`,
            `${PACK.commands.map((cmd, i) => `|  (${i+1}) ${cmd.name}`).join('\n')}`,
            `|`
        )
    }
}


export const prepPackCommand = (PACK, packCommand, packCommandIndex) => {
    if(!packCommand.name){
        FATAL(
            `@ command [${packCommandIndex}]`,
            `Missing field "name"`
        )
    }
    if(packCommand.useSlash && !packCommand.description){
        WARNING(
            `@ command "${packCommand.name}"`,
            `Missing field "description"`,
            '',
            `Slash commands should contain a short description`,
            `to help the user understand the purpose and usage`,
            ``,
            `Displayed in slash command menu and "${PACK.prefix || '/'}help" message`
        )
    }else if(packCommand.useSlash && packCommand.description.trim().length <=3 ){
        WARNING(
            `@ command "${packCommand.name}"`,
            `Field "description" must be at least 4 characters`,
            '',
            `Slash commands should contain a short description`,
            `to help the user understand the purpose and usage`,
            ``,
            `Displayed in slash command menu and "${PACK.prefix || '/'}help" message`
        )
    }
}



export const prepPackCommandOption = (PACK, packCommand, packCommandOption, packCommandOptionIndex) => {
    if(!packCommandOption.name){
        FATAL(`ToyBot command "${packCommand.name}" option [${packCommandOptionIndex}] missing "name"`)
    }
    if(!packCommandOption.description){
        WARNING(
            `@ command "${packCommand.name}" option [${packCommandOptionIndex}]`,
            `Missing field "desciption"`,
            '',
            `Slash command options should contain a short`,
            `description to help the user understand the`,
            `purpose and usage of the option`,
            ``,
            `Displayed in slash command menu and ${PACK.prefix || '!'}help message`
        )
    }else if(packCommandOption.description.trim().length <=3 ){
        WARNING(
            `@ command "${packCommand.name}" option [${packCommandOptionIndex}]`,
            `Field "description" must be at least 4 characters`,
            '',
            `Slash command options should contain a short `,
            `description to help the user understand the`,
            `purpose and usage of the option`,
            ``,
            `Displayed in slash command menu and ${PACK.prefix || '!'}help message`
        )
    }
}



export const prepHelpCommand = (PACK, hasCustomHelpCommand) => {
    if(!hasCustomHelpCommand){
        if(PACK.prefix){
            LOG(`| Creating default "${PACK.prefix}help" command...`)
        }else{
            LOG(`| Creating default "/help" command...`)
        }
    }else{
        if(PACK.commands.some(x => x.useSlash && x.name.toLowerCase() === 'help')){
            LOG(`| Assigning custom "/help" command...`)
        }else{
            LOG(`| Assigning custom "${PACK.prefix}help" command...`)
        }
    }
}