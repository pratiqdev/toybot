const parseType = (type:string) => {
    let value

    switch(type){
        case 's':
        case 'str':
        case 'string': value = 'string'; break;
        case 'i':
        case 'int':
        case 'integer': value = 'integer'; break;
        case 'n':
        case 'num':
        case 'number': value = 'number'; break;
        case 'b':
        case 'bool':
        case 'boolean': value = 'boolean'; break;
        case 'r':
        case 'role': value = 'role'; break;
        case 'u':
        case 'user': value = 'user'; break;
        case 'm':
        case 'mention':
        case 'mentionable': value = 'mentionable'; break;
        
        
    }

    return value
}

export const assembleDefaultHelpMessage = (PACK) => {
    
    let helpMsg = ''
    let N = "\r\n"

    let slashCommands = []
    let prefixCommands = []
    Object.entries(PACK.commands).forEach(x => typeof x[1] === 'function' ? prefixCommands.push(x) : slashCommands.unshift(x))

    helpMsg += `__**${PACK.title} - help**__` 
    + N 
    + `${PACK.documentation ? PACK.documentation + N : '' }`
    + `*${PACK.description}*` 
    + N
    + N


    //! PREFIX COMMAND ////////////////////////////////////////////////////////////
    if(prefixCommands.length > 0){
        helpMsg += `__**Prefix Commands**__
        `
        prefixCommands.forEach((x,i)=>{
helpMsg += 
`
**\`${PACK.prefix}${x[0]}\`**`
        })
    }

    //! SLASH COMMAND /////////////////////////////////////////////////////////////
    if(slashCommands.length > 0){
        helpMsg += `__**Slash Commands**__
        ` 

        slashCommands.forEach((x,i)=>{
            helpMsg += 
`> **\`/${x[0]}${'options' in x[1] ? x[1].options.map(x => x.required ? ` [${x.name}]` : '').join('') : ''}\`**
> *${x[1].description}*
`

// IF OPTIONS =================================================================
if('options' in x[1] && x[1].options.length > 0){
//     helpMsg += 
// `> 
// `
// EACH OPTION =================================================================
x[1].options.sort((a,b) => a.required ? -1 : 1 ).forEach(opt => {
    helpMsg += 
`> 
> __${opt.name}__ <${parseType(opt.type)}> ${opt.required ? '(required)' : ''}
> *${opt.description}*
`
})
}
// END SLASH COMMAND BLOCKQUOTE ===============================================
helpMsg += 
`
`

        })
    }


    return helpMsg
}