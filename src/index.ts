import dotenv from 'dotenv'

// require('dotenv').config()
import {Client} from 'discord.js'
import { SlashCommandBuilder } from '@discordjs/builders'
import { REST } from '@discordjs/rest'
import { Routes } from 'discord-api-types/v9'
import * as TYPES from './types.js'
import log, { WARNING, FATAL, LOG } from './logItems.js'
import { prepPackConfig, prepPackCommandOption, prepHelpCommand, prepPrefixCommand, prepSlashCommand } from './preps.js'
import { generateSlashCommandOptions } from './slashOptions.js'
import { handleMessage } from './handleMessage.js'
import { handleInteraction } from './handleInteraction.js'
import { assembleDefaultHelpMessage } from './defaultHelp.js'

dotenv.config()



const toybot = (PACK: TYPES.I_ToybotConfig) => {
try{

    LOG(
        log.div(),
        '| ToyBot starting...',
        '|'
    )

    prepPackConfig(PACK)



    const client = new Client({ intents: PACK.intents });
    let rest = new REST({ version: '9' }).setToken(process.env.BOT_TOKEN);


    client.once('ready', () => {
        log.BLUE('| Generating commands...')
        
        const commands: any = []

        if(!(
            'help' in PACK.commands
            || 'Help' in PACK.commands
            || 'HELP' in PACK.commands
        )){
            const foundSlashTypeCommand = Object.entries(PACK.commands).some(cmd => typeof cmd[1] !== 'function' )
            // FATAL(`Found slash type command: ${foundSlashTypeCommand}`)
    
            if(foundSlashTypeCommand){
                LOG(`| Creating "/help" command...`)
                PACK.commands['help'] = {
                    description: `${PACK.title} - Help with commands, options and usage`,
                    // command: (ctx) => ctx.reply(assembleDefaultHelpMessage(PACK))
                    command: (ctx) => ctx.reply(assembleDefaultHelpMessage(PACK))
                }
            }else{
                LOG(`| Creating "${PACK.prefix}help" command...`)
                PACK.commands['help'] = (ctx) => ctx.reply(assembleDefaultHelpMessage(PACK))
                
            }
        }

        // prepHelpCommand(PACK, commands)

        Object.entries(PACK.commands).forEach((packCommand: any, packCommandIndex: number) => {
            let commandName = packCommand[0]
            let commandObject = packCommand[1]

            //! show the list of slash-commands and pack.commands
            // console.log('='.repeat(60))
            // console.log(`packCommand: ${packCommand}`)
            // console.log(`slash commands: ${commands.length}`, commands)
            // console.log(`pack commands: ${Object.entries(PACK.commands).length}`, PACK.commands)
            // console.log('='.repeat(60))

            if(typeof commandObject === 'function'){
                prepPrefixCommand(PACK, commandName, commandObject)
                // log.green(`prefix: ${commandName}`)

            }else{
                prepSlashCommand(PACK, commandName, commandObject)
                // log.green(`slash: ${commandName}`)

                const SLASH_COMMAND = new SlashCommandBuilder()

                SLASH_COMMAND.setName(commandName)
                SLASH_COMMAND.setDescription(commandObject.description || commandName)



                packCommand.options && packCommand.options!.forEach((packCommandOption: TYPES.I_CommandOption, packCommandOptionIndex:number) => {
                    prepPackCommandOption(PACK, packCommand, packCommandOption, packCommandOptionIndex)
                    generateSlashCommandOptions(SLASH_COMMAND, packCommandOption)
                })
                


                SLASH_COMMAND.toJSON()
                commands.push(SLASH_COMMAND)

            }
        })




        LOG('| Registering commands...')
        rest.put(Routes.applicationGuildCommands(PACK.client, PACK.guild), { body: commands })
            .then(() => LOG(
                '|',
                `| Setup successful`
            ))
        .catch((err:any) => {
            log.RED('Error registering commands:')
            console.error(err)
        })
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
        handleMessage(PACK, message)
    })

    // use the build in slash commands
    client.on('interactionCreate', async (interaction: any) => {
        handleInteraction(PACK, interaction)
    });

    // Login to Discord with your client's token
    client.login(process.env.BOT_TOKEN);
}catch(err){
    FATAL(err)
    console.log(err)
}
}


// const permissions
export default toybot