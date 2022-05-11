import { SlashCommandBuilder } from '@discordjs/builders'
import log, {WARNING, FATAL, LOG, DOCUMENTATION_LINK} from './logItems.js'

export const prepPackConfig = (PACK:any) => {
    const validConfigDirective = [
        '',
        `config = {`,
        `   title:       'myBot`,
        `   description: 'A bot for doing things'`,
        `   prefix:      '!!'`,
        `   guild:       '1234'`,
        `   client:      '4567'`,
        `   commands: [`,
        `     ...`,
        `   ]`,
        `}`,
        '',
        'View the documentation for examples of the config object',
        DOCUMENTATION_LINK,
    ]
    const suggestedPrefixList = [
        '!',
        '-',
        '$',
        '?',
        '%',
        '=',
    ]
    const disallowedPrefixList = [
        '/',
        '*',
        '@',
        '#'
    ]
    const suggestedPrefixDefinitions = [
        '! (exclamation)',
        '- (hyphen)',
        '$ (dollar)',
        '? (question)',
        '% (percent)',
        '= (equal)',
    ]
    const disallowedPrefixDefenitions = [
        '/ (slash - slash commands)',
        '* (asterisk - reserved)',
        '@ (at - user mentions)',
        '# (hash - channel mentions)'
    ]
    // validate token
    if(!process.env.BOT_TOKEN){
        FATAL(
            `Discord requires a "bot token" to interact with its API`,
            '',
            'This token should be set as an env var (BOT_TOKEN = xxxx)',
            `Be sure to add this token to .gitignore / .npmignore to prevent`,
            `unauthorized users from using this token`
        )
    }

    // validate pack content
    if(!PACK || Object.entries(PACK).length === 0){
        FATAL(
            `No config object was provided`,
            ...validConfigDirective
        )
    }
    if(!PACK.client){
        FATAL(
            `No client id (client) was provided`,
            ...validConfigDirective,
        )
    }
    if(!PACK.guild){
        FATAL(
            `No guild id (guild) was provided`,
            ...validConfigDirective,
        )
    }
    if(!PACK.title){
        FATAL(
            `No bot title was provided`,
            ...validConfigDirective
        )
    }
    if(!PACK.description){
        FATAL(
            `No bot description was provided`,
            ...validConfigDirective
        )
    }

    // validate prefix
    if(!PACK.prefix){
        FATAL(
            `No command prefix (prefix) was provided`,
            ...validConfigDirective
        )
    }
    else if(disallowedPrefixList.includes(PACK.prefix)){
        FATAL(
            `@ config.prefix "${PACK.prefix}" is not allowed`,
            'The following characters are not allowed:',
            disallowedPrefixDefenitions.map((x) => `\n|     ${x}`).join(''),
            '',
            `Use one of the following characters:`,
            suggestedPrefixDefinitions.map((x) => `\n|     ${x}`).join(''),

        )
    }
    else if(!suggestedPrefixList.includes(PACK.prefix)){
        WARNING(
            `@ config.prefix "${PACK.prefix}" is not recommended`,
            `Use one of the following characters:`,
            suggestedPrefixDefinitions.map((x) => `\n|     ${x}`).join(''),
        )
    }
    if(!PACK.intents || PACK.intents.length === 0){
        WARNING(
            '@ config',
            'Command intents should be set explicitly.',
            'The default of ["GUILDS"] will be used.'
        )
        PACK.intents = ['GUILD']
    }

    // validate intents
    else if(PACK.intents.length > 0){
        let validIntents = [
            'GUILDS',
            'GUILD_MEMBERS',
            'GUILD_BANS',
            'GUILD_EMOJIS_AND_STICKERS',
            'GUILD_INTEGRATIONS',
            'GUILD_WEBHOOKS',
            'GUILD_INVITES',
            'GUILD_VOICE_STATES',
            'GUILD_PRESENCES',
            'GUILD_MESSAGES',
            'GUILD_MESSAGE_REACTIONS',
            'GUILD_MESSAGE_TYPING',
            'DIRECT_MESSAGES',
            'DIRECT_MESSAGE_REACTIONS',
            'DIRECT_MESSAGE_TYPING',
            'GUILD_SCHEDULED_EVENTS',
        ]

        PACK.intents.forEach((x,i) => {
            if(!validIntents.includes(x)){
                FATAL(
                    `Invalid intents option found.`,
                    `[${i}]: "${x}"`,
                    '',
                    'Intents may only contain:',
                    validIntents.map(x => `\n|     - "${x}"`).join(''),
                    '',
                    'View the documentation for examples of "intents"',
                    DOCUMENTATION_LINK
                )
            }
        })
    }


    LOG(
        `| TITLE:    ${PACK.title}`,
        // `| DESCRIPTION: ${PACK.description}`,
        `| CLIENT:   ${PACK.client}`,
        `| CLIENT:   ${PACK.client}`,
        `| GUILD:    ${PACK.guild}`,
        PACK.prefix ? `| PREFIX:   ${PACK.prefix}` : ``,
        `| INTENTS:  ${PACK.intents.length} ${PACK.intents.map((x,i) => `\n|   (${i+1}) ${x}`).join('')}`,
        `|`,
        `| COMMANDS: ${Object.entries(PACK.commands).length}`,
        `${Object.entries(PACK.commands).map((cmd, i) => 
            `|   (${i+1}) ${typeof cmd[1] === 'function' ? PACK.prefix : '/'}${cmd[0]}`).join('\n')
        }`,
        `|`,
    )
}







export const prepSlashCommand = (PACK, commandName, commandObject) => {
    if(commandName.length > 32 ){
        FATAL(
            `@ command "${commandName}"`,
            `Command names must not be greater than 32 characters`,
        )
    }
    if(commandName.length > 20 ){
        WARNING(
            `@ command "${commandName}"`,
            `Command names should be 20 characters or fewer`,
        )
    }
    if(!/^[a-z0-9-_]*$/.test(commandName)){
        FATAL(
            `@ command ""${commandName}"`,
            `Command names can only contain the following characters:`,
            `  - (a-z) lowercase letters`,
            `  - (0-9) numbers`,
            `  - (-) hyphens`,
            `  - (_) underscores`
        )
    }
    if(!commandObject.description){
        WARNING(
            `@ command "${commandName}"`,
            `Missing field "description"`,
            '',
            `Slash commands should contain a short description`,
            `to help the user understand the purpose and usage`,
            ``,
            `Displayed in slash command menu and "${PACK.prefix || '/'}help" message`
        )
    }else if(commandObject.description.trim().length <=3 ){
        WARNING(
            `@ command "${commandName}"`,
            `Field "description" must be at least 4 characters`,
            '',
            `Slash commands should contain a short description`,
            `to help the user understand the purpose and usage`,
            ``,
            `Displayed in slash command menu and "${PACK.prefix || '/'}help" message`
        )
    }
}



export const prepPrefixCommand = (PACK, commandName, commandObject) => {
    if(commandName.length > 32 ){
        FATAL(
            `@ command "${commandName}"`,
            `Command names must not be greater than 32 characters`,
        )
    }
    if(commandName.length > 20 ){
        WARNING(
            `@ command "${commandName}"`,
            `Command names should be 20 characters or fewer`,
        )
    }
    if(!/^[a-z0-9-_]*$/.test(commandName)){
        FATAL(
            `@ command ""${commandName}"`,
            `Command names can only contain the following characters:`,
            `  - (a-z) lowercase letters`,
            `  - (0-9) numbers`,
            `  - (-) hyphens`,
            `  - (_) underscores`
        )
    }
}



export const prepPackCommandOption = (PACK, packCommand, packCommandOption, packCommandOptionIndex) => {
    if(!packCommandOption.name){
        FATAL(
            `@ command "${packCommand.name}" option [${packCommandOptionIndex}]`,
            `Command missing field "name"`
            )
    }
    if(!/^[a-z0-9-_]*$/.test(packCommandOption.name)){
        FATAL(
            `@ command "${packCommand.name}" option "${packCommandOption.name}"`,
            `Command option names can only contain the following characters:`,
            `  - (a-z) lowercase letters`,
            `  - (0-9) numbers`,
            `  - (-) hyphens`,
            `  - (_) underscores`
        )
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


// Help commands should always exist
// Create a default help command that lists the available commands and options
// The help command should be a slash command if any other commands use the 
// slash type, otherwise use a prefix type help command

export const prepHelpCommand = (PACK, commandsArray) => {

    if(!(
        'help' in PACK.commands
        || 'Help' in PACK.commands
        || 'HELP' in PACK.commands
    )){
        const foundSlashTypeCommand = Object.entries(PACK.commands).some(cmd => typeof cmd[1] !== 'function' )
        // FATAL(`Found slash type command: ${foundSlashTypeCommand}`)

        if(foundSlashTypeCommand){
            LOG(`| Creating "/help" command...`)
            let SLASH_COMMAND = new SlashCommandBuilder()
            .setName('help')
            .setDescription('Show a list of commands and options available in this bot.')
            .toJSON()
            commandsArray.push(SLASH_COMMAND)
        }else{
            LOG(`| Creating "${PACK.prefix}help" command...`)
            PACK.commands.help = (t) => { t.reply('default help command!') }
            
        }
    }
    // else{
    //     if(PACK.prefix){
    //         LOG(`| Assigning custom "${PACK.prefix}help" command...`)
    //     }else{
    //         LOG(`| Assigning custom "/help" command...`)
    //     }
    // }
}