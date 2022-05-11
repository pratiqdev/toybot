import { WARNING, LOG } from "./logItems.js";
import utilities from './utilities.js'

export const handleInteraction = (PACK, interaction) => {
    if (!interaction.isCommand()) return;


    if(interaction.commandName in PACK.commands){
        const CURRENT_COMMAND = PACK.commands[interaction.commandName]
        interaction.utilities = utilities
        interaction.values = {}
        interaction.options._hoistedOptions.forEach((opt: any) => {
            interaction.values[opt.name] = opt.value
        })

        if('roles' in CURRENT_COMMAND && CURRENT_COMMAND.roles.length > 0){
            let ALLOWED = false
            let DEFAULT_DENIAL_MSG = CURRENT_COMMAND.roles.length === 1
                ? `This command requires the role: ${CURRENT_COMMAND.roles[0]}`
                : `This command requires at least one of the following roles: ${CURRENT_COMMAND.roles.map(role => `\n - "${role}"`).join('')}`

            let ROLE_DENIAL_REPLACED = CURRENT_COMMAND.roleDenial
                ? CURRENT_COMMAND.roleDenial
                    .replace('{{command}}', `"${interaction.commandName}"`)
                    .replace('{{role}}', `"${CURRENT_COMMAND.roles[0]}"`)
                    .replace('{{roles}}', `${CURRENT_COMMAND.roles.map(r => `"${r}"`).join(', ')}`)
                : null
            
                CURRENT_COMMAND.roles.forEach(cmdRole => {
                // console.log(`CHECKING ROLE: ${cmdRole}`)
                if(
                    interaction.member.roles.cache.has(cmdRole) 
                    || interaction.member.roles.cache.some(role => role.name === cmdRole)
                ){
                    ALLOWED = true
                }
            })
            if(ALLOWED){
                CURRENT_COMMAND.command(interaction)
            }else{
                interaction.reply(ROLE_DENIAL_REPLACED || DEFAULT_DENIAL_MSG)
            }
        }else{
            // console.log(`NO ROLES REQUIRED: "${interaction.commandName}"`)
            CURRENT_COMMAND.command(interaction)
        }
    }

}