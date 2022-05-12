import { MessageEmbed } from "discord.js";
import { SimpleStore } from './simpleStore.js'

const store = new SimpleStore()

const wait = (time = 1000) => {
    return new Promise((res)=>{
        setTimeout(()=>{
            res('done')
        }, time)
    })
}


export default {
    MessageEmbed,
    wait,
    store: {
        set: store.set,
        get: store.get,
        update: store.update,
        remove: store.update,
        getAll: store.getAll,
    }
}