export const handleInteraction = (PACK, interaction) => {
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
}