import toybot from '../index.js'
import axios from 'axios'

const apiPath = 'https://jsonplaceholder.typicode.com/todos'

toybot({
    title: 'API Bot',
    description: 'A Discord bot that communicates with an API',
    guild: '965727814676516906',                    
    client: '973251476258422854',
    commands: {

        'get-todos': {
            description: 'Get the 10 most recent todos',
            command: async ctx => {
                let {printArray} = ctx.utils

                await ctx.deferReply('Getting todos...')

                try{
                    let reply = '...'
                    let {data, status, statusText} = await axios.get(apiPath)
                    if(status === 200){
                        reply = printArray(
                            data.reverse().map(x => `${x.completed ? ':small_blue_diamond:' : ':small_orange_diamond:'}  ${x.title}`),
                            10
                        )
                    }else{
                        reply = `ERR - ${status}: ${statusText}`
                    }
                    await ctx.editReply(reply)
                }catch(err){
                    await ctx.editReply(JSON.stringify(err, null, 2))
                }
            }
        },

    }
})