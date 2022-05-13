import { DEBUG, WARNING, WARN_NOW } from "./logItems.js"

export const catchCommand = async (PACK, ctx, cmd) => {
    try{
        await cmd(ctx)
    }catch(err){

        WARN_NOW(
            'ERROR (START)---------------------------------------------',
            `type: ${typeof err}`,
            err,
            'ERROR (END)-----------------------------------------------',
        )

        if(PACK.testMode){
            DEBUG('--- catchCommand | testMode')
            if(ctx.deferred || ctx.replied){
                DEBUG('--- catchCommand | testMode | deferred/replied')
                ctx.editReply(
                    `Command Error:\n\`\`\`${ctx.commandName || ctx.command} \n\n${err}\`\`\``
                    )
                }else{
                    DEBUG('--- catchCommand | testMode | reply')
                ctx.reply(
                    `Command Error:\n\`\`\`${ctx.commandName || ctx.command} \n\n${err}\`\`\``
                )
            }
        }
    }
}