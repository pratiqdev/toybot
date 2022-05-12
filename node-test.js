const str = `My Cool Bot   `

const command = str.toLowerCase().trim().replace(/\s+/g, '-')

console.log(`"${command}"`)