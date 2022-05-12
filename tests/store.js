import { SimpleStore } from '../dist/simpleStore.js'
const store = new SimpleStore()

const newStore = {
    json:'object',
    with:'values',
    already:'set',
    nested: {
        values: 'are easy to parse with getAll'
    }
}

console.log('store test')

store.fillStore(newStore)


let res = await store.get('json')
console.log(res)

res = await store.get('with')
console.log(res)

res = await store.get('already')
console.log(res)

res = await store.getAll()
console.log(res)