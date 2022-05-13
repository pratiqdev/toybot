import { SlashCommandBuilder } from '@discordjs/builders'
import {DEBUG, WARNING, FATAL, LOG, DOCUMENTATION_LINK} from './logItems.js'

const hasAnyPrefixCommands = (PACK) => PACK.commands && Object.entries(PACK.commands).some(x => typeof x[1] === 'function')
const hasAnySlashCommands = (PACK) => PACK.commands && Object.entries(PACK.commands).some(x => typeof x[1] === 'object')

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
        `     'do-thing': ctx => {},`,
        `     'do-more': {`,
        `        description: 'Does more'`,
        `        command: ctx => {}`,
        `     },`,
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
            `Be sure to add this token to .gitignore / .npmignore to `,
            `prevent unauthorized use of this bot.`
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
        if(hasAnyPrefixCommands(PACK) && PACK.testMode){
            WARNING.create(
                `No command prefix (prefix) was provided.`,
                `Prefix commands will use default '!' prefix.`,
                ...validConfigDirective
            )
        }
        PACK.prefix = '!'
    }
    else{
        if(PACK.prefix.length > 3){
            FATAL(
                `@ config.prefix "${PACK.prefix}" is too long`,
                'The prefix must be 3 characters or fewer.',

            )
        }else if(PACK.prefix.length > 1){
            WARNING.create(
                `@ config.prefix "${PACK.prefix}" is too long`,
                'The prefix should only use a single character.',
            )
        }
        if(disallowedPrefixList.includes(PACK.prefix)){
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
            WARNING.create(
                `@ config.prefix "${PACK.prefix}" is not recommended`,
                `Use one of the following characters:`,
                suggestedPrefixDefinitions.map((x) => `\n|     ${x}`).join(''),
            )
        }
    }




    // validate intents
    if(!PACK.intents || PACK.intents.length === 0){
        // check if commands uses a basic prefix command
        if(hasAnyPrefixCommands(PACK)){
            WARNING.create(
                '@ config.intents',
                'Command intents should be set explicitly.',
                '',
                'Prefix commands require a minimum of',
                '"GUILD_MESSAGES" and "GUILDS" intent.',
                '',
                '["GUILD_MESSAGES", "GUILDS"] will be assigned.'
            )
            PACK.intents = ['GUILD_MESSAGES', 'GUILDS']
        }else{
            PACK.intents = []
        }
    }
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



    // validate commands object
    if(!PACK.commands || typeof PACK.commands !== 'object'){
        FATAL(
            '@ config.commands',
            'The config must contain an object of commands',
            ...validConfigDirective
        )
    }else if(Object.entries(PACK.commands).length === 0){
        FATAL(
            '@ config.commands',
            'The commands object must contain commands'
        )
    }


    LOG(
        `| TITLE:    ${PACK.title}`,
        // `| DESCRIPTION: ${PACK.description}`, //! too long, not necessary here
        `| CLIENT:   ${PACK.client}`,
        `| GUILD:    ${PACK.guild}`,
        PACK.prefix ? `| PREFIX:   ${PACK.prefix}` : ``,
        `| INTENTS:  ${PACK.intents.length} ${PACK.intents.map((x,i) => `\n|   (${i+1}) ${x}`).join('')}`,
        `|`,
        `| COMMANDS: ${Object.entries(PACK.commands).length}`,
        `${Object.entries(PACK.commands).map((cmd, i) => 
            `|   ${(i+1) < 10 ? `(${i+1}) ` : `(${i+1})`} ${typeof cmd[1] === 'function' ? PACK.prefix : '/'}${cmd[0]}`).join('\n')
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
        WARNING.create(
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
        WARNING.create(
            `@ command "${commandName}"`,
            `Missing field "description"`,
            '',
            `Slash commands should contain a short description`,
            `to help the user understand the purpose and usage`,
            ``,
            `Displayed in slash command menu and "${PACK.prefix || '/'}help" message`
        )
    }else if(commandObject.description.trim().length <=3 ){
        WARNING.create(
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


/**
 * Validate prefix command.
 * Checks for valid name.
 * 
 * @param PACK 
 * @param commandName 
 * @param commandObject 
 */
export const prepPrefixCommand = (PACK, commandName, commandObject) => {
    DEBUG(`STEP 2 (c/${commandName}) - Prepping prefix command`)
    if(commandName.length > 32 ){
        FATAL(
            `@ command "${commandName}"`,
            `Command names must not be greater than 32 characters`,
        )
    }
    if(commandName.length > 20 ){
        WARNING.create(
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






/**
 * Validate a a single slash command option.
 * Checks for valid name and description

* @param PACK 
 * @param packCommand 
 * @param packCommandOption 
 * @param packCommandOptionIndex 
 */
export const prepPackCommandOption = (PACK, packCommand, packCommandOption, packCommandOptionIndex) => {
    DEBUG(`STEP 2 (c/${packCommand.name}) - Prepping slash command option: ${packCommandOption}`)
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
        WARNING.create(
            `@ command "${packCommand.name}" option [${packCommandOptionIndex}]`,
            `Missing field "description"`,
            '',
            `Slash command options should contain a short`,
            `description to help the user understand the`,
            `purpose and usage of the option`,
            ``,
            `Displayed in slash command menu and ${PACK.prefix || '!'}help message`
        )
    }else if(packCommandOption.description.trim().length <=3 ){
        WARNING.create(
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






/**
 * Help commands should always exist
 * Create a default help command that lists the available commands and options
 * The help command should be a slash command if any other commands use the 
 * slash type, otherwise use a prefix type help command
 *
 *  @param PACK 
 * @param commandsArray 
 */
export const prepHelpCommand = (PACK, commandsArray) => {

    if(!(
        'help' in PACK.commands
        || 'Help' in PACK.commands
        || 'HELP' in PACK.commands
    )){

        if(hasAnySlashCommands(PACK)){
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
}