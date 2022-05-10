
import toybot from './index.js'

const helpMsg = 
`HELP MESSAGE:
This is a help message.
It will help you.
Maybe.
`

// toybot({})
toybot({
    guild: '965727814676516906',                    
    client: '973251476258422854',
    intents: ['GUILDS', 'GUILD_MESSAGES'],
    // prefix: '!!!',
    commands: [
        {
            name: 'help',
            useSlash: true,
            description: 'ZCXasdf',
            command: (toybot) => {
                toybot.reply('text1', 'text2')
            }
        },
        {
            name: 'test-prefix',
            // description: 'Runs a simple test of toybot',
            command: (toybot) => {
                toybot.reply('toybot test command!')
            }
        },
        {
            name: 'test-slash',
            // description: 'Runs a simple test of toybot',
            useSlash:true,
            options: [
                {
                    name: 'testvalue',
                    description: 'Provides a simple string argument as en example',
                    type: 'string',
                }
            ],
            command: (toybot) => {
                toybot.reply('toybot test command!')
            }
        }

    ],
    commandObj: {
        'obj-help': (t) => t.reply(helpMsg),
        'obj-prefix': (t) => t.reply('obj prefix test'),
        'obj-slash': {
            options: [
                {
                    name: 'testvalue',
                    description: 'Provides a simple string argument as en example',
                    type: 'string',
                }
            ],
            command: (toybot) => {
                toybot.reply('toybot test command!')
            }
        }
    }
})