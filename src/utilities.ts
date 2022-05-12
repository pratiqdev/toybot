import { MessageEmbed } from "discord.js";
import { SimpleStore } from './simpleStore.js'

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
    store: new SimpleStore()
}