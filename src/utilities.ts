import { inspect } from 'util'

/**
 * Create a delay between functions.
 * 
 * @param time 
 * @returns Promise
 */
const delay = (time = 1000) => {
    return new Promise((res)=>{
        setTimeout(()=>{
            res('done')
        }, time)
    })
}



/**
 * Convert an array to a string with newlines for each item.
 * Safely limits the length of string to 2000 or fewer characters.
 * 
 * @param arr - the array of data
 * @param length - how many items to print (optional)
 * @returns string
 */
const safeArray = (arr: any[], length?: number) => {
    let str = ''
    let totalLength = arr.length
    let usedItems = 0
    
    if(length && typeof length === 'number'){
        arr = arr.filter((x,i) => i < length)
    }

    const getRemaining = () => {

        let remaining = totalLength - usedItems > 999 
        ? `1000+` 
        : `${totalLength - usedItems}`
        
        return `\n... ${remaining} more items`
    }
        
    for(let i = 0; i < arr.length; i++){
        let x = arr[i]
        if(typeof x === 'string'){
            let d = `\n${x}`
            if(str.length + d.length > 1970){
                str += getRemaining()
                break;
            }else{
                usedItems++
                str += d
            }
        }else{
            let d = `\n${JSON.stringify(x)}`
            if(str.length + d.length > 1970){
                str += getRemaining()
                break;
            }else{
                usedItems++
                str += d
            }
        }
    }

    return str
}



/**
 * Convert an object to a string and stay within a safe limit of characters
 * and replace circular dependencies.
 * Similar to the output of console.log
 * @param obj 
 * @returns 
 */
const safeObject = (obj: object, length: number = 2000) => {
    if(length > 2000) length = 2000
    else if(length < 0) length = 0

    let objectString = inspect(obj, {depth: null, compact:false})

    function splitAtIndex(value, index){
        if(index < 0) index = 0
        return [value.substring(0, index), value.substring(index)]
    }


    if(objectString.length > length && length === 2000){
        let spl = splitAtIndex(objectString, length - 20)
        let remaining = spl[1].split('\n').length
        if(remaining > 999){
            objectString = spl[0] + `\n... 1000+ more lines`
        }else{
            objectString = spl[0] + `\n... ${remaining} more lines`
        }
    }else{
        let spl = splitAtIndex(objectString, length)
        objectString = spl[0]
    }

    return objectString
}



/**
 * Trim a string to fit within safe limits and append ellipses if limit is exceeded.
 * 
 * @param str - the string to trim
 * @returns string
 */
const safeString = (str:string) => {
    if(str.length > 2000){
        str = str.substring(0, 1997) + '...'
    }
    return str
}



export default {
    delay,
    safeArray,
    safeObject,
    safeString,
}
