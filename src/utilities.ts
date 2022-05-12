
const delay = (time = 1000) => {
    return new Promise((res)=>{
        setTimeout(()=>{
            res('done')
        }, time)
    })
}

export default {
    delay
}
