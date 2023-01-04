import {Atom, atom} from 'nanostores'

if (!String.prototype.hasOwnProperty('int'))
    Object.defineProperty<String>(String.prototype, 'int', {
        get() {
            return parseInt(this!)
        }
        //writable: false
    })

if (!String.prototype.hasOwnProperty('safeInt'))
    Object.defineProperty<String>(String.prototype, 'safeInt', {
        get() {
            return this ? parseInt(this!) : undefined
        }
    })

/*
export const defineProperties = (state: Atom<string[]>) => {
    Object.defineProperty(state, 'has', {
        // @ts-ignore
        has(v: any) {
            debugger
            const curr = this.get()
            return !curr.length || curr.includes(v)
        }
    })
}*/

