import { MessageEmbed } from "discord.js";

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
}