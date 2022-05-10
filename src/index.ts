import dotenv from 'dotenv'

// require('dotenv').config()
import {Client} from 'discord.js'
import { SlashCommandBuilder } from '@discordjs/builders'
import { REST } from '@discordjs/rest'
import { Routes } from 'discord-api-types/v9'
import * as TYPES from './types.js'
import log from './logItems.js'

dotenv.config()

const DOCUMENTATION_LINK = 'https://www.npmjs.com/package/toybot'

const WARNING = (...msg:any) => {
    log.yellow('')
    log.yellow(log.div())
    log.yellow('| WARNING:')
    msg.forEach((x:string) => log.yellow(`|   ${x}`))
    log.yellow(log.div())
    log.yellow('')
}

const FATAL = (...msg:any) => {
    log.RED('')
    log.RED(log.div())
    log.RED('| ERROR:')
    msg.forEach((x:string) => log.RED(`|   ${x}`))
    log.RED(log.div())
    log.RED('')
    process.exit(0)
}

const LOG = (...msg:any) => {
    msg.forEach((x:string) => log.BLUE(x))
}


const toybot = (PACK: TYPES.I_ToybotConfig) => {
try{

    LOG(
        log.div(),
        '| ToyBot starting...',
        '|'
    )
    // Require the necessary discord.js classes

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

    const hasCustomHelpCommand = PACK.commands.some(cmd => cmd.name === 'help')

    // Create a new client instance
    const intents:any = PACK.intents || ['GUILDS']
    const partials:any = PACK.partials || []
    PACK.intents && log.BLUE(`| Setting intents: [${intents.join(', ')}]`)
    PACK.partials && log.BLUE(`| Setting partials: [${partials.join(', ')}]`)

    const client = new Client({ intents, partials });
    // Create a new rest instance
    let rest:any = null
    if(!process.env.BOT_TOKEN){
        FATAL(`ERROR | No "BOT_TOKEN" environment variable found`)
    }else{
        rest = new REST({ version: '9' }).setToken(process.env.BOT_TOKEN);
    }

    const HELP_COMMAND = null


    //+ Run all setup functions when ToyBot starts
    client.once('ready', () => {
        log.BLUE('| Generating commands...')
        
        //+ Create an array of slash commands using SlashCommandBuilder constructor 
        const commands: any = []
        PACK.commands.forEach((packCommand: TYPES.I_CommandStruct, packCommandIndex:number) => {
            
            // do not create a command object for items with a prefix
            // prefixed commands can only be accessed by using the prefix
            if(!('useSlash' in packCommand) || packCommand.useSlash !== true) return

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

            if(packCommand && 'options' in packCommand && packCommand.options!.length > 0){

                
                // create a new command instance
                const SLASH_COMMAND = new SlashCommandBuilder()

                SLASH_COMMAND.setName(packCommand.name)
                SLASH_COMMAND.setDescription(packCommand.description || packCommand.name)



                packCommand.options!.forEach((packCommandOption: TYPES.I_CommandOption, packCommandOptionIndex:number) => {

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

                    switch(packCommandOption.type.toLowerCase()){
                        case 'i':
                        case 'int':
                        case 'integer':
                            SLASH_COMMAND.addIntegerOption((OPTION:any) => {
                                OPTION.setName(packCommandOption.name)
                                OPTION.setDescription(packCommandOption.description || packCommandOption.name)
                                    packCommandOption.required    && OPTION.setRequired(packCommandOption.required)
                                    packCommandOption.min         && OPTION.setMinValue(packCommandOption.min)
                                    packCommandOption.max         && OPTION.setMinValue(packCommandOption.max)
                                return OPTION
                            })
                        break;
                        case 'n':
                        case 'num':
                        case 'number':
                            SLASH_COMMAND.addNumberOption((OPTION:any) => {
                                OPTION.setName(packCommandOption.name)
                                OPTION.setDescription(packCommandOption.description || packCommandOption.name)
                                    packCommandOption.required    && OPTION.setRequired(packCommandOption.required)
                                    packCommandOption.min         && OPTION.setMinValue(packCommandOption.min)
                                    packCommandOption.max         && OPTION.setMinValue(packCommandOption.max)
                                return OPTION
                            })
                        break;
                        case 'b':
                        case 'bool':
                        case 'boolean':
                            SLASH_COMMAND.addBooleanOption((OPTION:any) => {
                                OPTION.setName(packCommandOption.name)
                                OPTION.setDescription(packCommandOption.description || packCommandOption.name)
                                    packCommandOption.required    && OPTION.setRequired(packCommandOption.required)
                                return OPTION
                            })
                        break;
                        default:
                            SLASH_COMMAND.addStringOption((OPTION: any) => {
                                OPTION.setName(packCommandOption.name);
                                OPTION.setDescription(packCommandOption.description || packCommandOption.name);
                                    packCommandOption.required    && OPTION.setRequired(packCommandOption.required)
                                return OPTION
                            })
                    }
                })
                


                SLASH_COMMAND.toJSON()
                commands.push(SLASH_COMMAND)
            }else{
                let SLASH_COMMAND = new SlashCommandBuilder()
                    SLASH_COMMAND.setName(packCommand.name)
                    SLASH_COMMAND.setDescription(packCommand.description || packCommand.name)
                    SLASH_COMMAND.toJSON()
                commands.push(SLASH_COMMAND)
            }
        })

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

        LOG('| Registering commands...')
        rest.put(Routes.applicationGuildCommands(PACK.client, PACK.guild), { body: commands })
            .then(() => LOG(
                '| Commands registered',
                `| Setup successful`
            ))
        .catch(console.error)
        .finally(()=>{
            LOG(log.div())
            LOG('')
            log.GREEN(log.div())
            log.GREEN('| TOYBOT ACTIVE')
            log.GREEN(log.div())
        })

        




    });

    // use a custom prefix
    client.on('messageCreate', async (message: any) => {
        if (message.author.bot) return;
        if(!PACK.prefix || PACK.prefix === '' || PACK.prefix === '/') return;


            if (message.content.startsWith(PACK.prefix) && message.content.length > PACK.prefix.length) {
                const args = message.content.slice(PACK.prefix.length).split(' ');
                const command = args.shift();

                if(!hasCustomHelpCommand && command.toLowerCase() === 'help'){
                    message.reply('HHHHHELPP!!!')
                }

                PACK.commands.forEach(cmd => {
                    if(cmd.name === command){
                        (async()=>{
                            // interaction.values = {}
                            // interaction.options._hoistedOptions.forEach(opt => {
                            //     interaction.values[opt.name] = opt.value
                            // })
                            await cmd.command(message)
                        })()
                    }
                })

            }

    })

    // use the build in slash commands
    client.on('interactionCreate', async (interaction: any) => {
        if (!interaction.isCommand()) return;

        PACK.commands.forEach(cmd => {
            if(cmd.name === interaction.commandName){
                if('prefix' in cmd) return;
                (async()=>{
                    interaction.values = {}
                    interaction.options._hoistedOptions.forEach((opt: any) => {
                        interaction.values[opt.name] = opt.value
                    })
                    // let inter = JSON.stringify({...interaction}, null, 2)
                    // interaction.reply(inter)
                    await cmd.command(interaction)
                })()
            }
        })
    
    });

    // Login to Discord with your client's token
    client.login(process.env.BOT_TOKEN);
}catch(err){
    console.log(err)
}
}


// const permissions
export default toybot