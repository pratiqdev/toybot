import dotenv from 'dotenv'

import {Client} from 'discord.js'
import { SlashCommandBuilder } from '@discordjs/builders'
import { REST } from '@discordjs/rest'
import { Routes } from 'discord-api-types/v9'

import * as TYPES from './types.js'
import { div, WARNING, FATAL, LOG, DEBUG } from './logItems.js'
import { prepPackConfig, prepPackCommandOption, prepPrefixCommand, prepSlashCommand } from './preps.js'
import { generateSlashCommandOptions } from './slashOptions.js'
import { assembleDefaultHelpMessage } from './defaultHelp.js'
import { handleMessage } from './handleMessage.js'
import { handleInteraction } from './handleInteraction.js'





dotenv.config()



const toybot = (PACK: TYPES.I_ToybotConfig) => {
    try{
        LOG(
            div,
            `| ToyBot: Creating bot${PACK.testMode ? ' in test mode' : ''}...`,
            '|',
        )

        prepPackConfig(PACK)

        const STATS:any = {
            startTime: 0,
            upTime: 0,
            commandsUsed: 0,
            commands: {
                help: 0,
            }
        }
        const client = new Client({ intents: PACK.intents });
        let rest = new REST({ version: '9' }).setToken(process.env.BOT_TOKEN);
        
        client.once('ready', async () => {
            LOG('| Client ready...')
            STATS.startTime = Date.now()
                        
            const commands: any = []
            const globalCommands: any = []

            //+ STEP 1 //////////////////////////////////////////////////////////////////////////////////////////////////////
            const step1_generateHelpCommand = () => {
                return new Promise((res)=>{
                DEBUG('STEP 1 - generate help command')

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
                            res('')
                        }else{
                            LOG(`| Creating "${PACK.prefix}help" command...`)
                            PACK.commands['help'] = (ctx) => ctx.reply(assembleDefaultHelpMessage(PACK))
                            res('')
                        }
                    }
                })
            }
            
            //+ STEP 2 //////////////////////////////////////////////////////////////////////////////////////////////////////
            const step2_generatePackCommands = () => {
                return new Promise((res)=>{
                DEBUG('STEP 2 - generate pack commands')
                

                    PACK.commands 
                    && Object.entries(PACK.commands).forEach(async (packCommand: any, packCommandIndex: number) => {
                        
                        DEBUG('STEP 2 (a) - Looping through PACK.commands object')
                        let commandName = packCommand[0]
                        let commandObject = packCommand[1]
                        STATS.commands[commandName] = 0
                        
                        
                        if(typeof commandObject === 'function'){
                            prepPrefixCommand(PACK, commandName, commandObject)
                            
                        }else if(typeof commandObject === 'object'){
                            DEBUG(`STEP 2 (b/${packCommandIndex}) - Prepping slash type command: ${commandName}`)
                            prepSlashCommand(PACK, commandName, commandObject)
                            
                            const SLASH_COMMAND = new SlashCommandBuilder()
            
                            SLASH_COMMAND.setName(commandName)
                            SLASH_COMMAND.setDescription(commandObject.description || commandName)
            
            
                            commandObject.options && commandObject.options.forEach((packCommandOption: TYPES.I_CommandOption, packCommandOptionIndex:number) => {
                                // DEBUG(`STEP 2 (c/${packCommandIndex}) - Prepping slash command option: ${packCommandOption}`)
                                prepPackCommandOption(PACK, packCommand, packCommandOption, packCommandOptionIndex)
                                generateSlashCommandOptions(SLASH_COMMAND, commandName, packCommandOption)
                            })
                            
                            
                            try{
                                SLASH_COMMAND.toJSON()
                                commands.push(SLASH_COMMAND)
                            }catch(err){
                                FATAL('ERROR PUSHING SLASH COMMANDS')
                            }finally{
                                DEBUG(`STEP 2 (c/${packCommandIndex}) - Pushed slash command to commands array`)
                                res('')
                            }
            
                        }
                        else{
                            FATAL(
                                'Command objects must be of type function or object.',
                                `Examples:`,
                                `'cmd': (ctx) => {} `,
                                `'cmd': {} `,
                            )
                        }
                    })



                    PACK.globalCommands 
                    && Object.entries(PACK.globalCommands).forEach(async (packCommand: any, packCommandIndex: number) => {
                        
                        DEBUG('STEP 2 (a) - Looping through PACK.commands object')
                        let commandName = packCommand[0]
                        let commandObject = packCommand[1]
                        STATS.commands[commandName] = 0
                        
                        
                        if(typeof commandObject === 'function'){
                            prepPrefixCommand(PACK, commandName, commandObject)
                            
                        }else if(typeof commandObject === 'object'){
                            DEBUG(`STEP 2 (b/${packCommandIndex}) - Prepping slash type command: ${commandName}`)
                            prepSlashCommand(PACK, commandName, commandObject)
                            
                            const SLASH_COMMAND = new SlashCommandBuilder()
            
                            SLASH_COMMAND.setName(commandName)
                            SLASH_COMMAND.setDescription(commandObject.description || commandName)
            
            
                            commandObject.options && commandObject.options.forEach((packCommandOption: TYPES.I_CommandOption, packCommandOptionIndex:number) => {
                                // DEBUG(`STEP 2 (c/${packCommandIndex}) - Prepping slash command option: ${packCommandOption}`)
                                prepPackCommandOption(PACK, packCommand, packCommandOption, packCommandOptionIndex)
                                generateSlashCommandOptions(SLASH_COMMAND, commandName, packCommandOption)
                            })
                            
                            
                            try{
                                SLASH_COMMAND.toJSON()
                                globalCommands.push(SLASH_COMMAND)
                            }catch(err){
                                FATAL('ERROR PUSHING SLASH COMMANDS')
                            }finally{
                                DEBUG(`STEP 2 (c/${packCommandIndex}) - Pushed slash command to commands array`)
                                res('')
                            }
            
                        }
                        else{
                            FATAL(
                                'Command objects must be of type function or object.',
                                `Examples:`,
                                `'cmd': (ctx) => {} `,
                                `'cmd': {} `,
                            )
                        }
                    })

                    res('')

                })
            }
            
            //+ STEP 3 //////////////////////////////////////////////////////////////////////////////////////////////////////
            const step3_registerCommands = async () => {
                return new Promise((res)=>{
                LOG('| Registering commands...')
                    try{
                        rest.put(Routes.applicationGuildCommands(PACK.client, PACK.guild), { body: commands })
                    }catch(err){
                        FATAL('Could not register commands', err)
                    }finally{
                        res('done')
                    }  
                })
            }
            
            await step1_generateHelpCommand()
            await step2_generatePackCommands()
            await step3_registerCommands()


            LOG(
                '|',
                `| Setup successful`,
                div,
                '',
            )

            WARNING.log()

        });


        client.on('messageCreate', async (message: any) => {
            if (
                'testMode' in PACK 
                && PACK.testMode === true 
            ) {
                if(message.content === `!${PACK.title.trim().toLowerCase().replace(/\s+/g, '-')}-restart`){
                    await message.reply('Manually restarting bot...')
                    client.removeAllListeners()
                    client.destroy()
                    toybot(PACK)
                }
            }
            
            // handleStoreUpdate(PACK, message)
            handleMessage(PACK, STATS, message)
        })

        // use the build in slash commands
        client.on('interactionCreate', async (interaction: any) => {
            handleInteraction(PACK, STATS, interaction)
        });


        client.login(process.env.BOT_TOKEN);
    }catch(err){
        FATAL(err)
        console.log(err)
    }
}


// const permissions
export default toybot