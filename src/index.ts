import dotenv from 'dotenv'

// require('dotenv').config()
import {Client} from 'discord.js'
import { SlashCommandBuilder } from '@discordjs/builders'
import { REST } from '@discordjs/rest'
import { Routes } from 'discord-api-types/v9'
import * as TYPES from './types.js'
import log, { WARNING, FATAL, LOG } from './logItems.js'
import { prepPackCommand, prepPackConfig, prepPackCommandOption, prepHelpCommand } from './preps.js'
import { generateSlashCommandOptions } from './slashOptions.js'
import { handleMessage } from './handleMessage.js'
import { handleInteraction } from './handleInteraction.js'

dotenv.config()



const toybot = (PACK: TYPES.I_ToybotConfig) => {
try{

    LOG(
        log.div(),
        '| ToyBot starting...',
        '|'
    )

    prepPackConfig(PACK)


    // Check if the pack contain a custom help command
    const hasCustomHelpCommand = PACK.commands.some(cmd => 
        cmd.name.toLowerCase() === 'help'
    )

    // Create a new client instance
    const intents:any = PACK.intents || ['GUILDS']
    const partials:any = PACK.partials || []
    PACK.intents && log.BLUE(`| Setting intents: [${intents.join(', ')}]`)
    PACK.partials && log.BLUE(`| Setting partials: [${partials.join(', ')}]`)

    const client = new Client({ intents, partials });
    // Create a new rest instance
    let rest = new REST({ version: '9' }).setToken(process.env.BOT_TOKEN);

    const HELP_COMMAND = null


    //+ Run all setup functions when ToyBot starts
    client.once('ready', () => {
        log.BLUE('| Generating commands...')
        
        //+ Create an array of slash commands using SlashCommandBuilder constructor 
        const commands: any = []



        
        log.WHITE(log.div())
        Object.entries(PACK.commandObj).forEach((packCommand: any) => {
            console.log(packCommand)
        })
        log.WHITE(log.div()
        
        
        
        
        )
        PACK.commands.forEach((packCommand: TYPES.I_CommandStruct, packCommandIndex:number) => {
            
            // do not create a command object for items with a prefix
            // prefixed commands can only be accessed by using the prefix
            if(!('useSlash' in packCommand) || packCommand.useSlash !== true) return

            prepPackCommand(PACK, packCommand, packCommandIndex)

            if(packCommand && 'options' in packCommand && packCommand.options!.length > 0){

                
                // create a new command instance
                const SLASH_COMMAND = new SlashCommandBuilder()

                SLASH_COMMAND.setName(packCommand.name)
                SLASH_COMMAND.setDescription(packCommand.description || packCommand.name)



                packCommand.options!.forEach((packCommandOption: TYPES.I_CommandOption, packCommandOptionIndex:number) => {
                    prepPackCommandOption(PACK, packCommand, packCommandOption, packCommandOptionIndex)
                    generateSlashCommandOptions(SLASH_COMMAND, packCommandOption)
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

        prepHelpCommand(PACK, hasCustomHelpCommand)


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
        handleMessage(PACK, message, hasCustomHelpCommand)
    })

    // use the build in slash commands
    client.on('interactionCreate', async (interaction: any) => {
        handleInteraction(PACK, interaction)
    });

    // Login to Discord with your client's token
    client.login(process.env.BOT_TOKEN);
}catch(err){
    console.log(err)
}
}


// const permissions
export default toybot