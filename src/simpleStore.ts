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
        return new Promise((res)=>{
            if(!(key in this.store)){
                this.store[key] = value
                res({
                    success: true,
                    message: `Set key "${key}"`,
                    value: null,
                })
            }else{
                res({
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
        return new Promise((res)=>{
            if(key in this.store){
                this.store[key] = value
                res({
                    success: true,
                    message: `Updated key "${key}"`,
                    value: null,
                })
            }else{
                res({
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
        return new Promise((res)=>{
            if(key in this.store && typeof this.store[key] !== 'undefined'){
                res({
                    success: true,
                    message: `Get key "${key}"`,
                    value: this.store[key]
                })
            }else{
                res({
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
        return new Promise((res)=>{
            if(key in this.store){
                delete this.store[key]
                res({
                    success: true,
                    message: `Deleted key "${key}"`,
                    value: null
                })
            }else{
                res({
                    success: false,
                    message: `Key "${key}" not found`,
                    value: null
                })
            }
        })
    }


    fillStore(newStore: object){
        return new Promise((res)=>{
            // make sure the new store is an object and not an array
            if(Array.isArray(newStore) || typeof newStore !== 'object'){
                res({
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
                    res({
                        success: false,
                        message: 'Error creating store',
                        value: null
                    })
                }
            }
        })
    }

    setStore(key:string, newStore: object){
        return new Promise((res)=>{
            // make sure the new store is an object and not an array
            if(Array.isArray(newStore) || typeof newStore !== 'object'){
                res({
                    success: false,
                    message: `New store must be an object`,
                    value: null
                })
            }else{
                this.store[key] = newStore
                if(JSON.stringify(this.store) === JSON.stringify(newStore)){
                    res({
                        success: true,
                        message: `Store key ${key} set from file`,
                        value: null // should i return the new store so user can compare if they want?
                    })
                }else{
                    res({
                        success: false,
                        message: 'Error setting key from file',
                        value: null
                    })
                }
            }
        })
    }

    emptyStore(object: object){
        return new Promise((res)=>{
            this.store = {}
            if(JSON.stringify(this.store) === '{}'){
                res({
                    success: true,
                    message: `Store emptied`,
                    value: null
                })
            }else{
                res({
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
    getAll() {
        return new Promise((res)=>{
            res({
                success: true,
                message: `Get store`,
                value: this.store
            })
        })
    }

}
