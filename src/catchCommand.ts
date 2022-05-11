export const catchCommand = async (PACK, ctx, cmd) => {
    try{
        await cmd(ctx)
    }catch(err){
        console.error(err)
        console.log('CONTEXT--------------------------------------------------')
        console.log(ctx)
        console.log('^^^^^^^--------------------------------------------------')

        if(PACK.testMode){
            if(ctx.deferred || ctx.replied){
                ctx.editReply(
                    `Command Error:\n\`\`\`${ctx.commandName || ctx.command} \n\n${err}\`\`\``
                )
            }else{
                ctx.reply(
                    `Command Error:\n\`\`\`${ctx.commandName || ctx.command} \n\n${err}\`\`\``
                )
            }
        }
    }
}