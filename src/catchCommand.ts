import { DEBUG, WARNING } from "./logItems.js"

export const catchCommand = async (PACK, ctx, cmd) => {
    try{
        await cmd(ctx)
    }catch(err){

        let errStr = JSON.stringify(err)
        WARNING.create(
            'ERROR (START)---------------------------------------------',
            errStr,
            'ERROR (END)-----------------------------------------------',
        )

        if(PACK.testMode){
            DEBUG('--- catchCommand | testMode')
            if(ctx.deferred || ctx.replied){
                DEBUG('--- catchCommand | testMode | deferred/replied')
                ctx.editReply(
                    `Command Error:\n\`\`\`${ctx.commandName || ctx.command} \n\n${errStr}\`\`\``
                    )
                }else{
                    DEBUG('--- catchCommand | testMode | reply')
                ctx.reply(
                    `Command Error:\n\`\`\`${ctx.commandName || ctx.command} \n\n${errStr}\`\`\``
                )
            }
        }
    }
}