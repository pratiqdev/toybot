export const handleMessage = (PACK, message, hasCustomHelpCommand) => {

    if (message.author.bot) return;
    if(!PACK.prefix || PACK.prefix === '' || PACK.prefix === '/') return;


    if (message.content.startsWith(PACK.prefix) && message.content.length > PACK.prefix.length) {
        const args = message.content.slice(PACK.prefix.length).split(' ');
        const command = args.shift();

        if(!hasCustomHelpCommand && command.toLowerCase() === 'help'){
            message.reply('HHHHHELPP!!!')
        }

        PACK.commands.forEach(cmd => {
            if(cmd.name === command){
                (async()=>{
                    // interaction.values = {}
                    // interaction.options._hoistedOptions.forEach(opt => {
                    //     interaction.values[opt.name] = opt.value
                    // })
                    await cmd.command(message)
                })()
            }
        })

    }}