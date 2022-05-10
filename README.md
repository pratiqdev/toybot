# ToyBot

Create a discord bot the easy way.


## Simple.


Commands will use the original `!command` prefix syntax unless `useSlash: true` is
present in the command definition.




## Installation

yarn
```bash
$ yarn add toybot
```

npm
```bash
$ npm install toybot
```





## Setup

Discord requires a token to access the bot API. Create an environment
variable with the name `BOT_TOKEN`
```
BOT_TOKEN=000000000000000000000000000000000
```





## Usage

Invoke the `toybot` function with a config object that contains:

| Key | Type | Description |
|:--|:--|:--|
guild   | string | The guild (server) id
client  | string | The client id
intents | string[] | An array of permissions
commands | command[] | An array of bot commands with callback functions
prefix | string | A character or string used to invoke non-slash commands


index.js
```js
const toybot = require('toybot')

toybot({
    guild: '965727814676516906',
    client: '973251476258422854',
    intents: ['GUILDS', 'GUILD_MESSAGES'],
    prefix: '!',
    commands: [
        {
            name: 'test',
            description: 'Runs a simple test of bebop',
            command: (b) => {
                b.reply('ToyBot test command!')
            }
        },
        {
            name: 'help',
            description: 'ToyBot instructions / help',
            command: (b) => {
                b.reply('Custom help command...')
            }
        },

        {
            name: 'test-bb-options',
            description: 'Analyze data from ToyBot object',
            useSlash: true,
            options: [
                {
                    name: 'brap',
                    type: 'string',
                    required: true
                },
                {
                    name: 'vrips',
                    type: 'int',
                    min: 4,
                    max: 12
                },
                {
                    name: 'shlep',
                    type: 'user',
                }
            ],
            command: (bb) => {

                const object = JSON.stringify({
                   values: bb.values,
                }, null, 2)

                bb.reply(object)
            }
        }
    ]
})
```



## Intents / Partials


- GUILDS
- GUILD_MEMBERS
- GUILD_BANS
- GUILD_EMOJIS_AND_STICKERS
- GUILD_INTEGRATIONS
- GUILD_WEBHOOKS
- GUILD_INVITES
- GUILD_VOICE_STATES
- GUILD_PRESENCES
- GUILD_MESSAGES,
- GUILD_MESSAGE_REACTIONS
- GUILD_MESSAGE_TYPING
- DIRECT_MESSAGES,
- DIRECT_MESSAGE_REACTIONS
- DIRECT_MESSAGE_TYPING
- GUILD_SCHEDULED_EVENTS






## Commands

Command objects define how a command will be called and what actions to perform

```js
...
commands: [
    {
        name: 'prefix-command',
        command: (msg) => {
            // prefix commands provide access to the `message` object
            msg.reply('A reply from "command-one"')
        }
    },
    {
        name: 'slash-command',
        description: 'This function invoked with a slash command',
        useSlash: true,
        command: (intr) => {
            // slash commands provide access to the `interaction` object
            intr.reply('A simple slash command')
        }
    },
    {
        name: 'slash-command-advanced',
        description: 'This function invoked with a slash command',
        useSlash: true,
        options: [
            {
                name: 'someValue',
                type: 'string',
                required: true
            },
        ]
        command: (intr) => {
            intr.reply(`Command with arguments: ${intr.values.someValue}`)
        }
    }
]
...


```