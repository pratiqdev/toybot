export const div = "-".repeat(60)

class WarningCollector {
    warnings: any[];

    constructor(){
        this.warnings = []
    }

    create(...msg){
        this.warnings.push(msg)
    }

    log(){
        this.warnings.forEach(warning => {
            console.log('')
            console.log(div)
            console.log('| WARNING:')
            console.log('|')
            warning.forEach((x:string) => console.log(`|   ${x}`))
            console.log(div)
            console.log('')
        })
    }
}

export const WARN_NOW = (...msg) => {
        console.log('')
        console.log(div)
        console.log('| WARNING:')
        console.log('|')
        msg.forEach((x:string) => console.log(`|   ${x}`))
        console.log(div)
        console.log('')
}

export const WARNING = new WarningCollector()

export const FATAL = (...msg:any) => {
    console.log('')
    console.log(div)
    console.log('| ERROR:')
    msg.forEach((x:string) => console.log(`|   ${x}`))
    console.log(div)
    console.log('')
    process.exit(0)
}

export const LOG = (...msg:any) => {
    msg.forEach((x:string) => console.log(x))
}

export const DEBUG_MODE = false
export const DEBUG = (...msg:any) => {
    DEBUG_MODE && msg.forEach((x:string) => console.log(x))
}

export const DOCUMENTATION_LINK = 'https://www.npmjs.com/package/toybot'
