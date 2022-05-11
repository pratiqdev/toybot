
import toybot from './index.js'

const helpMsg = 
`HELP MESSAGE:
This is a help message.
It will help you.
Maybe.
`

// toybot({})
toybot({
    title: 'BlepBot',
    description: 'A bot for blepping the beepers and borping the beep bops. Pure borps',
    documentation: 'https://my-site-url.com/docs',
    guild: '965727814676516906',                    
    client: '973251476258422854',
    intents: ['GUILDS', 'GUILD_MESSAGES'],
    prefix: ':',
    commands: {
        // 'help': (t) => t.reply(helpMsg),
        'prefix': ctx => ctx.reply('toybot prefix test command'),
        // 'prefix-command-length-warning': ctx => ctx.reply('TEST: prefix command name length warning'),
        // 'prefix-command-length-fatal-error-too-long': ctx => ctx.reply('TEST: prefix command name length fatal'),
        // 'slash-command-length-warning': {
        //     description: 'TEST: slash command name length warning',
        //     command: ctx => ctx.reply('TEST: slash command name length warning')
        // },
        // 'slash-command-length-fatal-error-too-long': {
        //     description: 'TEST: slash command name length fatal',
        //     command: ctx => ctx.reply('TEST: slash command name length warning')
        // },
        'slash': {
            description: 'simple test of a slash command',
            options: [
                {
                    name: 'testValue',
                    description: 'Provides a simple string argument as en example',
                    type: 'string',
                },
                {
                    name: 'testInt',
                    description: 'Provides a simple integer argument',
                    type: 'int',
                    required: true
                }
            ],
            command: (t) => {
                t.reply('toybot slash test command')
            }
        },
        'role-test': {
            description: 'simple test of a slash command with roles',
            roles: ['Member', 'Beep', 'Boop'],
            roleDenial: 'Command {{command}} requires {{roles}} role...',
            command: (t) => {
                t.reply('toybot role test command')
            }
        },
        'utility-test-slash': {
            description: 'simple test of context utilities',
            command: (ctx) => {
                let hasUtilities = 'utilities' in ctx && 'MessageEmbed' in ctx.utilities
                ctx.reply(`Accessed utilities: ${hasUtilities}`)
            }
        },
    }
})