
import toybot from './index.js'

import { WARNING, LOG, DEBUG } from './dist/logItems.js'




const helpMsg = 
`HELP MESSAGE:
This is a help message.
It will help you.
Maybe.
`

// toybot({})
toybot({
    testMode: true,
    title: 'BlepBot',
    description: 'A bot for blepping the beepers and borping the beep bops. Pure borps',
    documentation: 'https://my-site-url.com/docs',
    guild: '965727814676516906',                    
    client: '973251476258422854',
    intents: ['GUILDS', 'GUILD_MESSAGES'],
    prefix: '::',
    commands: {
        // 'help': (t) => t.reply(helpMsg),
        'basic-prefix': ctx => ctx.reply('test-prefix'),
        'basic-prefix-args': ctx => ctx.reply(`test-prefix-args: ${ctx.args.length}: ${ctx.args}`),
        'adv-prefix-error': ctx => ctx.reply('!'.repeat(10_000)),


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



        'basic-slash': {
            description: 'simple test of a slash command',
            command: (ctx) => {
                ctx.reply('test-slash')
            }
        },


        'basic-options': {
            description: 'simple test of a slash command',
            options: [
                {
                    name: 'test-value',
                    description: 'Provides a simple string argument as en example',
                    type: 'string',
                    required: true
                },
                {
                    name: 'test-int',
                    description: 'Provides a simple integer argument',
                    type: 'int',
                    required: true
                },
                {
                    name: 'test-bool',
                    description: 'Provides a simple boolean argument',
                    type: 'bool',
                    required: true
                },
                {
                    name: 'test-user',
                    description: 'Provides a simple user argument',
                    type: 'user',
                    required: true
                },
                {
                    name: 'test-role',
                    description: 'Provides a simple role argument',
                    type: 'role',
                    required: true
                },
                {
                    name: 'test-mentionable',
                    description: 'Provides a simple mentionable argument',
                    type: 'mention',
                    required: true
                },
            ],
            command: (ctx) => {
                ctx.reply(`test-options: ${Object.entries(ctx.values).map(x => `\n${x[0]} : ${x[1]}`)}`)
            }
        },


        // Only allow users with certain roles permission to use this command
        // Provide a custom role denial message with `roleDenial`
        // roleDenail offers replacements for:
        // {{command}} - the command that was used
        // {{role}} - the first role in the array (should be ordered from min - max)
        // {{roles}} - the array of roles
        'basic-role': {
            description: 'simple test of a slash command with roles',
            roles: ['Member', 'Beep', 'Boop'],
            roleDenial: 'Command {{command}} requires {{roles}} role...',
            command: (ctx) => {
                ctx.reply('toybot role test command')
            }
        },


        // Provide access to built-in Discord utilities and functions
        'basic-utility': {
            description: 'simple test of context utilities',
            command: (ctx) => {
                let hasUtilities = 'utils' in ctx && 'MessageEmbed' in ctx.utils
                ctx.reply(`Accessed utilities: ${hasUtilities} ${ctx.utils}`)
            }
        },


        // Delay a response with `deferReply`
        'adv-defer-response': {
            description: 'simple test of a delayed response',
            command: async (ctx) => {
                await ctx.deferReply();
                await ctx.utils.wait(4000);
                await ctx.editReply('Delayed response!');
            }
        },

        // Delay a response with ephemeral `deferReply` (only command caller can see message)
        'adv-defer-ephemeral': {
            description: 'simple test of a delayed ephemeral response',
            command: async (ctx) => {
                await ctx.deferReply({ ephemeral: true });
                await ctx.utils.wait(4000);
                await ctx.editReply('Delayed response!');
            }
        },


        // Delay a response with custom `deferReply` text 
        'adv-defer-custom': {
            description: 'simple test of a delayed custom response',
            command: async (ctx) => {
                await ctx.deferReply('Deferring reply custom text...');
                await ctx.utils.wait(4000);
                await ctx.editReply('Delayed response!');
            }
        },

        // Delay a response with `reply` / `edit` to use a custom ctx.utils.wait message
        'adv-reply-edit': {
            description: 'simple test of an edited reply',
            command: async (ctx) => {
                await ctx.reply('custom ctx.utils.waiting...');
                await ctx.utils.wait(1000);
                await ctx.editReply('edit');
                await ctx.utils.wait(1000);
                await ctx.editReply('message');
                await ctx.utils.wait(1000);
                await ctx.editReply('within');
                await ctx.utils.wait(1000);
                await ctx.editReply('15');
                await ctx.utils.wait(1000);
                await ctx.editReply('minutes');
                
            }
        },

        // Follow up to a response after delay
        'adv-reply-follow-up': {
            description: 'simple test of a delayed follow up',
            command: async (ctx) => {
                await ctx.reply('Primary reply');
                await ctx.utils.wait(3000);
                await ctx.followUp('Follow up reply!');
            }
        },



        // Follow up to a response after delay
        'adv-reply-append': {
            description: 'simple test of a appended message',
            command: async (ctx) => {
                let msg = `Primary message`

                await ctx.reply(msg);
                
                await ctx.utils.wait(3000);
                msg += `\nnew text!!`
                await ctx.editReply(msg);

                await ctx.utils.wait(3000);
                msg += `\nmore text!!`
                await ctx.editReply(msg);
            }
        },



        // Print the config object
        'adv-config-object': {
            description: 'simple test of a config object',
            command: (ctx) => {

                let table = "Config Object:\n```"

                Object.entries(ctx.config).forEach(x => {
                    table += `\n${x[0]}` + ` `.repeat(16 - x[0].length) + x[1]
                })

                table += "```"

                ctx.reply(table)
            }
        },



         // Print the config object
         'adv-api-get': {
            description: 'simple test of a config object',
            command: async (ctx) => {

                await ctx.deferReply()
                await ctx.utils.wait(1000)

                let { data } = await ctx.util.get('https://jsonplaceholder.typicode.com/todos')

                

                let table = "API Response:\n"

                data.filter((x,i) => i < 20 ).forEach(x => {
                    table += `\n${x.id} - ${x.title}`
                })


                await ctx.editReply(table)
            }
        },


        // Print the config object
        'adv-slash-error': {
            description: 'simple test of a config object',
            command: async (ctx) => {

                await ctx.deferReply()
                await ctx.utils.wait(1000)

                let { data } = await ctx.util.get('https://jsonplaceholder.typicode.com/todos')

                

                let table = "API Response:\n"   

                data.filter((x,i) => i < 2000 ).forEach(x => {
                    table += `\n${x.id} - ${x.title}`
                })


                await ctx.editReply(table)
            }
        },



        // SimpleStore test
        // Replies accept a single argument of non-empty string.
        // Store may respond with non-string types or empty string,
        // User must covert values with `.toSting()` or `JSON.stringify()`
        'store-test': {
            description: 'simple test of SimpleStore',
            command: async (ctx) => {
                const { store, wait } = ctx.utils
                let res

                await ctx.reply('Testing store');
                await wait();

                await store.set('test_a', 1234)
                await ctx.editReply('Set store tuple');
                await wait();
                
                res = await store.get('test_a')
                await ctx.editReply(res.message);
                await wait();
                await ctx.editReply(JSON.stringify(res.value));
                
                await wait();
                
                res = await store.getAll()
                await ctx.editReply(res.message);
                await wait();
                await ctx.editReply(JSON.stringify(res.value));
                
                // console.log(`message: ${res.message}`)
                // console.log(`value: ${res.value}`)
                
            }
        },


        // SimpleStore fillStore test
        'store-test-after-fill': {
            description: 'simple test of SimpleStore fill command',
            command: async (ctx) => {
                const { store, wait } = ctx.utils
                let res
                try{

                    await ctx.reply('Testing store after fill...');
                    
                    await wait();
                    
                    res = await store.get('some-data')
                    await ctx.editReply(res.success ? JSON.stringify(res.value) : res.message);
                }catch(err){
                    await ctx.editReply(JSON.stringify(err));
                }
                
            }
        },
    }
})