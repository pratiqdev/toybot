# ToyBot

Create a discord bot the easy way. Setup basic prefix commands or use slash 
commands to provide more options, details and better default help messages.




--------------------------------------------------------------------------------
## Installation

yarn
```bash
$ yarn add toybot
```

npm
```bash
$ npm install toybot
```


--------------------------------------------------------------------------------



## Token

Discord requires a token to access the bot API. Create an environment
variable with the name `BOT_TOKEN`
```
BOT_TOKEN=000000000000000000000000000000000
```



--------------------------------------------------------------------------------


## Usage

Invoke the `toybot` function with a config object that contains:

| Key | Type | Description |
|:--|:--|:--|
title   | string | The name of the bot
description   | string | A short description of the bot and its uses
documentation | string | The URL of a documentation site or website (appears in default help command)
prefix | string | A character or string used to invoke non-slash commands
guild   | string | The guild (server) id
client  | string | The client id
intents | string[] | An array of permissions
commands | object | An object containing the commands
testMode | boolean | Set to true to catch and log errors and results to the console


index.js
```js
const toybot = require('toybot')

toybot({
    title: 'myCoolBot',
    description: 'A really cool bot for handling repetitive tasks',
    documentation: 'https://my-site-url.com/docs',
    prefix: '!',
    guild: '965727814676516906',
    client: '973251476258422854',
    intents: ['GUILDS', 'GUILD_MESSAGES'],
    commands: {
        'doThis': ctx => ctx.reply('I am a bot.'),
        'doThat': ctx => ctx.reply('Am I a bot?'),
        'doMore': {
            description: 'Do stuff and things',
            command: ctx => ctx.reply('I did it.')
        },
    }
})
```






--------------------------------------------------------------------------------

## Commands

Command objects define how a command will be called and what actions to perform

```js
...
commands: {
    /*
    Prefix commands are the easiest to setup and use
    The key is the command name and the value is the 
    function called as a command.
    !simple-prefix
    */
    'simple-prefix': (ctx) => { ctx.reply('I am a bot') },

    /*
    Slash commands use an object containing details and
    options for the command.
    /simple-slash
    */
    'simple-slash': {
        description: 'Provide a description',
        command: (ctx) => { ctx.reply() }
    },

    /*
    Slash commands provide more control. 
    Descriptions appear in the command menu and help message.
    Role restrictions allow fine control over permissions.
    Options provide easy access to arguments/parameters.
    */
    'advanced-slash':{
        description: 'Fine grained control',
        roles: ['Member', 'Admin', 'Owner'],
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
        command: (ctx) => {
            ctx.reply(`The brap is ${ctx.values.brap}`)
        }
    }
}
...


```











--------------------------------------------------------------------------------

## Message

### Command Definition

```js
'some-command': (ctx) => { console.log(ctx) }
```

### Command Invocation

```
!some-command
```

### Message Context Object

```js

<ref *1> Message {
  channelId: '01234567890123456789',
  guildId: '01234567890123456789',
  id: '01234567890123456789',
  createdTimestamp: 1652213358204,
  type: 'DEFAULT',
  system: false,
  content: '!!some-command with args',
  author: User {
    id: '01234567890123456789',
    bot: false,
    system: false,
    flags: UserFlags { bitfield: 0 },
    username: 'someDiscordUser',
    discriminator: '4567',
    avatar: 'abcdef0123456789abcdef',
    banner: undefined,
    accentColor: undefined
  },
  pinned: false,
  tts: false,
  nonce: '01234567890123456789',
  embeds: [],
  components: [],
  attachments: Collection(0) [Map] {},
  stickers: Collection(0) [Map] {},
  editedTimestamp: null,
  reactions: ReactionManager { message: [Circular *1] },
  mentions: MessageMentions {
    everyone: false,
    users: Collection(0) [Map] {},
    roles: Collection(0) [Map] {},
    _members: null,
    _channels: null,
    crosspostedChannels: Collection(0) [Map] {},
    repliedUser: null
  },
  webhookId: null,
  groupActivityApplication: null,
  applicationId: null,
  activity: null,
  flags: MessageFlags { bitfield: 0 },
  reference: null,
  interaction: null,
  message: '!!some-command',
  prefix: '!!',
  command: 'some-command',
  args: ['with','args']
}
```
















--------------------------------------------------------------------------------

## Interaction

### Command Definition

```js
'some-command': {
    description: 'Log the return object',
    options: [
        {
            name: 'someArg'
            type: 'string',
            required: true
        }
    ]
    command: (obj) => { console.log(obj) }
}
```

### Command Invocation

```
/some-command [someArg: xyz]
```

### Command Context Object

```js
CommandInteraction {
  type: 'APPLICATION_COMMAND',
  id: '123456789123456789',
  applicationId: '123456789123456789',
  channelId: '123456789123456789',
  guildId: '123456789123456789',
  user: User {
    id: '123456789123456789',
    bot: false,
    system: false,
    flags: UserFlags { bitfield: 0 },
    username: 'someDiscordUser',
    discriminator: '4567',
    avatar: 'abcdef0123456789abcdef',
    banner: undefined,
    accentColor: undefined
  },
  member: GuildMember {
    guild: Guild {
      id: '123456789123456789',
      name: 'myServer',
      icon: 'abcdef0123456789abcdef',
      features: [Array],
      commands: [GuildApplicationCommandManager],
      members: [GuildMemberManager],
      channels: [GuildChannelManager],
      bans: [GuildBanManager],
      roles: [RoleManager],
      presences: PresenceManager {},
      voiceStates: [VoiceStateManager],
      stageInstances: [StageInstanceManager],
      invites: [GuildInviteManager],
      scheduledEvents: [GuildScheduledEventManager],
      available: true,
      shardId: 0,
      splash: null,
      banner: null,
      description: null,
      verificationLevel: 'LOW',
      vanityURLCode: null,
      nsfwLevel: 'DEFAULT',
      discoverySplash: null,
      memberCount: 4,
      large: false,
      premiumProgressBarEnabled: false,
      applicationId: null,
      afkTimeout: 300,
      afkChannelId: null,
      systemChannelId: null,
      premiumTier: 'NONE',
      premiumSubscriptionCount: 0,
      explicitContentFilter: 'ALL_MEMBERS',
      mfaLevel: 'NONE',
      joinedTimestamp: 1652135753579,
      defaultMessageNotifications: 'ONLY_MENTIONS',
      systemChannelFlags: [SystemChannelFlags],
      maximumMembers: 500000,
      maximumPresences: null,
      approximateMemberCount: null,
      approximatePresenceCount: null,
      vanityURLUses: null,
      rulesChannelId: null,
      publicUpdatesChannelId: null,
      preferredLocale: 'en-US',
      ownerId: '123456789123456789',
      emojis: [GuildEmojiManager],
      stickers: [GuildStickerManager]
    },
    joinedTimestamp: 1650317853383,
    premiumSinceTimestamp: null,
    nickname: null,
    pending: false,
    communicationDisabledUntilTimestamp: null,
    _roles: [ '123456789123456789' ],
    user: User {
      id: '123456789123456789',
      bot: false,
      system: false,
      flags: [UserFlags],
      username: 'someDiscordUser',
      discriminator: '4567',
      avatar: 'abcdef0123456789abcdef',
      banner: undefined,
      accentColor: undefined
    },
    avatar: null
  },
  version: 1,
  memberPermissions: Permissions { bitfield: 4398046511103n },
  locale: 'en-US',
  guildLocale: 'en-US',
  commandId: '123456789123456789',
  commandName: 'some-command',
  deferred: false,
  replied: false,
  ephemeral: null,
  webhook: InteractionWebhook { id: '123456789123456789' },
  options: CommandInteractionOptionResolver {
    _group: null,
    _subcommand: null,
    _hoistedOptions: []
  },
  values: {
      'someArg': 'xyz'
  }
}
```











--------------------------------------------------------------------------------

## Available Intents

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












--------------------------------------------------------------------------------
## Utilities

ToyBot inserts utility functions into the context object for messages and interactions.
The utilities include:

- `MessageEmbed` - from Discordjs
- `wait` - simple promise based timeout
- `store` - basic json based key:value store (not persistent)




### Message Embed








### Wait

A simple promise based timeout function to add delays between execution of commands
with a default of 1000ms. Must be used with async/await.

```js
'do-stuff': async (ctx) => {
  await ctx.deferReply('Lets wait a sec...')
  await ctx.utils.wait()
  await ctx.editReply('Okay thats long enough')
}
```






### Store

A stateful class that provides methods for interacting with the key:value store.

| Method | Description |
|:--|:--|
`set(key, value)`  | Create a key and assign a value if the key does not already exist
`get(key)` | Get a value by its key
`update(key, value)` | Update the value of a key if the key exists
`remove(key)` | Delete a key:value by its key
`getAll()` | Return the entire store object. Useful for parsing nested values.

**Commands**

The store comes with built-in commands for uploading a `.json` file to set the 
state of the store or set a key:value where the value is the data from the file.
Bot names in the command must be lowercase

| Command | Attachment | Description |
|:--|:--|:--|
!botname-fill-store | .json | Set the store state to the data from the attached json file
!botname-set-store&nbsp;keyName | .json | Set or update a key with the value of the attached json file
!botname-empty-store |  | Set the state of the store to an empty object
