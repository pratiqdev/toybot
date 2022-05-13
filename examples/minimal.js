import toybot from '../index.js'

toybot({
    title: 'Minimal Bot',
    description: 'A minimal Discord bot',
    guild: '965727814676516906',                    
    client: '973251476258422854',
    commands: {
        'min': ctx => ctx.reply('minimal setup'),
    }
})