import { DEBUG, WARNING } from "./logItems.js"

export const catchCommand = async (PACK, ctx, cmd) => {
    try{
        await cmd(ctx)
    }catch(err){

        let errStr = JSON.stringify(err)
        WARNING(
            'ERROR (START)---------------------------------------------',
            errStr,
            'ERROR (END)-----------------------------------------------',
        )

        if(PACK.testMode){
            if(ctx.deferred || ctx.replied){
                ctx.editReply(
                    `Command Error:\n\`\`\`${ctx.commandName || ctx.command} \n\n${errStr}\`\`\``
                )
            }else{
                ctx.reply(
                    `Command Error:\n\`\`\`${ctx.commandName || ctx.command} \n\n${errStr}\`\`\``
                )
            }
        }
    }
}