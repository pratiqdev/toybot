import toybot from '../index.js'

const largeObject = {
    title: 'Donuts',
    description: 'A large object containing some donuts. Yum.',
    addr: 'https://www.donuts.com',
    bigArr: [
        {
            "id": "0001",
            "type": "donut",
            "name": "Cake",
            "ppu": 0.55,
            "batters":
                {
                    "batter":
                        [
                            { "id": "1001", "type": "Regular" },
                            { "id": "1002", "type": "Chocolate" },
                            { "id": "1003", "type": "Blueberry" },
                            { "id": "1004", "type": "Devil's Food" }
                        ]
                },
            "topping":
                [
                    { "id": "5001", "type": "None" },
                    { "id": "5002", "type": "Glazed" },
                    { "id": "5005", "type": "Sugar" },
                    { "id": "5007", "type": "Powdered Sugar" },
                    { "id": "5006", "type": "Chocolate with Sprinkles" },
                    { "id": "5003", "type": "Chocolate" },
                    { "id": "5004", "type": "Maple" }
                ]
        },
        {
            "id": "0002",
            "type": "donut",
            "name": "Raised",
            "ppu": 0.55,
            "batters":
                {
                    "batter":
                        [
                            { "id": "1001", "type": "Regular" }
                        ]
                },
            "topping":
                [
                    { "id": "5001", "type": "None" },
                    { "id": "5002", "type": "Glazed" },
                    { "id": "5005", "type": "Sugar" },
                    { "id": "5003", "type": "Chocolate" },
                    { "id": "5004", "type": "Maple" }
                ]
        },
        {
            "id": "0003",
            "type": "donut",
            "name": "Old Fashioned",
            "ppu": 0.55,
            "batters":
                {
                    "batter":
                        [
                            { "id": "1001", "type": "Regular" },
                            { "id": "1002", "type": "Chocolate" }
                        ]
                },
            "topping":
                [
                    { "id": "5001", "type": "None" },
                    { "id": "5002", "type": "Glazed" },
                    { "id": "5003", "type": "Chocolate" },
                    { "id": "5004", "type": "Maple" }
                ]
        }
    ]
}
largeObject.self = largeObject


toybot({
    title: 'Minimal Bot',
    description: 'A minimal Discord bot',
    guild: '965727814676516906',                    
    client: '973251476258422854',
    commands: {

        'delay': {
            description: 'Delay execution or responses',
            command: async ctx => {
                const { delay } = ctx.utils
                await ctx.deferReply()
                await ctx.editReply('Waiting 1 second...')
                await delay()
                await ctx.editReply('Waiting another second...')
                await delay()
                await ctx.editReply('Waiting 3 seconds...')
                await delay(3000)
                await ctx.editReply('Enough waiting.')

            }
        },

        'safe-string': {
            description: 'Safely print a long string',
            command: ctx => {
                const { safeString } = ctx.utils
                const tooLongString = 'x'.repeat(3000)

                ctx.reply(safeString(tooLongString))
            }
        },

        'safe-array': {
            description: 'Print each item of array on a newline',
            command: ctx => {
                const { safeArray } = ctx.utils
                const bigArr = new Array(1000).fill('abcd')

                ctx.reply(safeArray(bigArr))
            }
        },

        'safe-array-limited': {
            description: 'Print each item of array on a newline with a limit',
            command: ctx => {
                const { safeArray } = ctx.utils
                const bigArr = new Array(1000).fill('abcd')

                ctx.reply(safeArray(bigArr, 10))
            }
        },

        'safe-object': {
            description: 'Print each item of object on a newline',
            command: ctx => {
                const { safeObject } = ctx.utils

                ctx.reply(safeObject(largeObject))
            }
        },

        'safe-object-limited': {
            description: 'Print each item of object on a newline',
            command: ctx => {
                const { safeObject } = ctx.utils

                ctx.reply(safeObject(largeObject, 100))
            }
        }
    }
})