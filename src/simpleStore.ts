/*
{
    success: bool,
    message: 'Some action was performed',
    value: null
}
*/

export class SimpleStore {
    store: any;

    constructor(){
        this.store = {}
    }

    /** 
     * Set a value if it does not exist
     */
    set(key: string, value: any) {
        return new Promise((res, rej)=>{
            if(!(key in this.store)){
                this.store[key] = value
                res({
                    success: true,
                    message: `Set key "${key}"`,
                    value: null,
                })
            }else{
                rej({
                    success: false,
                    message: `Key "${key}" already exists`,
                    value: null
                })
            }
        })
    }


    /** 
     * Update a value if it exists
     */
    update(key: string, value: any) {
        return new Promise((res, rej)=>{
            if(key in this.store){
                this.store[key] = value
                res({
                    success: true,
                    message: `Updated key "${key}"`,
                    value: null,
                })
            }else{
                rej({
                    success: false,
                    message: `Key "${key}" not found`,
                    value: null
                })
            }
        })
    }


    /** 
     * Get and return a value if it exists
     */
    get(key: string) {
        return new Promise((res, rej)=>{
            if(key in this.store){
                res({
                    success: true,
                    message: `Get key "${key}"`,
                    value: this.store[key]
                })
            }else{
                rej({
                    success: false,
                    message: `Key "${key}" not found`,
                    value: null
                })
            }
        })
    }

    


    /** 
     * Get and return a value if it exists
     */
    remove(key: string) {
        return new Promise((res, rej)=>{
            if(key in this.store){
                delete this.store[key]
                res({
                    success: true,
                    message: `Deleted key "${key}"`,
                    value: null
                })
            }else{
                rej({
                    success: false,
                    message: `Key "${key}" not found`,
                    value: null
                })
            }
        })
    }


    fillStore(newStore: object){
        return new Promise((res, rej)=>{
            // make sure the new store is an object and not an array
            if(Array.isArray(newStore) || typeof newStore !== 'object'){
                rej({
                    success: false,
                    message: `New store must be an object`,
                    value: null
                })
            }else{
                this.store = newStore
                if(JSON.stringify(this.store) === JSON.stringify(newStore)){
                    res({
                        success: true,
                        message: 'Store created',
                        value: null // should i return the new store so user can compare if they want?
                    })
                }else{
                    rej({
                        success: false,
                        message: 'Error creating store',
                        value: null
                    })
                }
            }
        })
    }

    emptyStore(object: object){
        return new Promise((res, rej)=>{
            this.store = {}
            if(JSON.stringify(this.store) === '{}'){
                res({
                    success: true,
                    message: `Store emptied`,
                    value: null
                })
            }else{
                rej({
                    success: false,
                    message: `Could not empty store`,
                    value: null
                })
            }
        })
    }

    /** 
     * Get and return the entire store
     */
    getAll(key: string) {
        return new Promise((res, rej)=>{
            res({
                success: true,
                message: `Get store`,
                value: this.store
            })
        })
    }

}
