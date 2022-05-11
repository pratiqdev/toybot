export const assembleDefaultHelpMessage = (PACK) => {
    
    let helpMsg = ''
    let startBQ = ">>> "
    let endBQ = "\n\n\n\n"
    let BI = "**`"
    let IB = "`**"
    let N = "\r\n"
    let T = "     "

    let commandArray = []
    let slashCommands = []
    let prefixCommands = []
    Object.entries(PACK.commands).forEach(x => typeof x[1] === 'function' ? prefixCommands.push(x) : slashCommands.unshift(x))

    helpMsg += `__**${PACK.title} - help**__` 
    + N 
    + `${PACK.documentation ? PACK.documentation : '' }`
    + N 
    + `*${PACK.description}*` 
    + N
    + N

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
> __${opt.name}__ <${opt.type}> ${opt.required ? '(required)' : ''}
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

    //! PREFIX COMMAND ////////////////////////////////////////////////////////////
    if(prefixCommands.length > 0){
        helpMsg += `__**Prefix Commands**__
        `
        prefixCommands.forEach((x,i)=>{
helpMsg += 
`> **\`${PACK.prefix}${x[0]}\`**`
        })
    }

//     commandArray.forEach((x,i) => {

//         if(typeof x[1] === 'function'){
//             // assemble prefix style help
//             helpMsg += 
// `> **\`${PACK.prefix}${x[0]}\`**`

//         }else{
//             helpMsg += 
// `> **\`/${x[0]}${'options' in x[1] ? x[1].options.map(x => x.required ? ` [${x.name}]` : '').join('') : ''}\`**
// > *${x[1].description}*
// `

// // IF OPTIONS =================================================================
// if('options' in x[1] && x[1].options.length > 0){
// //     helpMsg += 
// // `> 
// // `
// // EACH OPTION =================================================================
// x[1].options.sort((a,b) => a.required ? -1 : 1 ).forEach(opt => {
//     helpMsg += 
// `> 
// > __${opt.name}__ <${opt.type}> ${opt.required ? '(required)' : ''}
// > *${opt.description}*
// `
// })
// }
// // END SLASH COMMAND BLOCKQUOTE ===============================================
// helpMsg += 
// `

// `


//         }
//     })


    return helpMsg
}