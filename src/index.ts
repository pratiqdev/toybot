import dotenv from 'dotenv'

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


            if(typeof commandObject === 'function'){
                prepPrefixCommand(PACK, commandName, commandObject)
                // log.green(`prefix: ${commandName}`)

            }else{
                prepSlashCommand(PACK, commandName, commandObject)

                const SLASH_COMMAND = new SlashCommandBuilder()

                SLASH_COMMAND.setName(commandName)
                SLASH_COMMAND.setDescription(commandObject.description || commandName)



                commandObject.options && commandObject.options.forEach((packCommandOption: TYPES.I_CommandOption, packCommandOptionIndex:number) => {
                    prepPackCommandOption(PACK, packCommand, packCommandOption, packCommandOptionIndex)
                    generateSlashCommandOptions(SLASH_COMMAND, commandName, packCommandOption)
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
            log.GREEN(`| TOYBOT ACTIVE ${PACK.testMode ? '(TEST MODE)' : ''}`)
            log.GREEN(log.div())
        })



        




    });


    let lastCtxObject = null

    // use a custom prefix
    client.on('messageCreate', async (message: any) => {
        lastCtxObject = message

        if (
            'testMode' in PACK 
            && PACK.testMode === true 
        ) {
            if(message.content === `!${PACK.title.toLowerCase()}-restart`){
                await message.reply('Manually restarting bot...')
                await client.removeAllListeners()
                await client.destroy()
                toybot(PACK)
            }

        }
        
        handleMessage(PACK, message)
    })

    // use the build in slash commands
    client.on('interactionCreate', async (interaction: any) => {
        lastCtxObject = interaction
        handleInteraction(PACK, interaction)
    });

    process.on('unhandledRejection', async (error:any) => {
        log.RED('PROCESS ERROR: Unhandled promise rejection:\n\n')
        console.error(error)
        
        if(PACK.testMode === true){
            
            try{
                log.RED('PROCESS ERROR: Unhandled promise rejection:\n\n')
                console.error(error);

                await lastCtxObject.channel.send("```ERROR:\n\n" + error + "\n\nErrors are likely to crash the bot.\nFix them while the bot is in test mode.\nThis error message will only appear if testMode is set to true.\nThis error message may not have originated in this channel or from the previous message/command.```")
            }catch(err){
                log.RED('PROCESS ERROR: Unhandled promise rejection + channel reply:\n\n')
                console.error(err)
            }
        }
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