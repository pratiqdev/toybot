import toybot from '../index.js'

toybot({
    title: 'Stats Bot',
    description: 'A Discord bot with meta stats',
    guild: '965727814676516906',                    
    client: '973251476258422854',
    commands: {
        'test-1': ctx => ctx.reply('test-1 called'),
        'test-2': ctx => ctx.reply('test-2 called'),
        'test-3': ctx => ctx.reply('test-3 called'),
        'stats': ctx => ctx.reply("```"+JSON.stringify(ctx.stats, null, 2)+"```")
    }
})