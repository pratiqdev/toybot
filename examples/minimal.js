import toybot from '../index.js'

toybot({
    title: 'Minimal Bot',
    description: 'A minimal Discord bot',
    guild: '965727814676516906',                    
    client: '973251476258422854',
    prefix: '!_!',
    commands: {
        'min': ctx => ctx.reply('minimal prefix'),
        // 'min': {
        //     description: 'basic slash test',
        //     command: ctx => ctx.reply('minimal slash')
        // }
    }
})