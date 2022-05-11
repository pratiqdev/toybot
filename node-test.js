import axios from 'axios'

console.log('axios get:')

let { data } = await axios.get('https://jsonplaceholder.typicode.com/todos')
console.log(data)