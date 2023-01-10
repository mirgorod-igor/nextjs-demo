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

if (!Array.prototype.hasOwnProperty('groupBy'))
    Array.prototype.groupBy = function<T, V = T[keyof T]>(keyName: keyof T) {
        return this.reduce((r, it) =>
            ((r[it[keyName]] || (r[it[keyName]] = [])).push(it), r),
            // @ts-ignore
            {} as Record<V, T[]>
        )
    }


if (!Array.prototype.hasOwnProperty('assoc'))
    Array.prototype.assoc = function<
        T extends Record<string, any>, KN extends keyof T, VN extends keyof T
    >(this: T[], nameKey: KN, nameValue: VN) {
        return this.reduce((r, it) =>
            (r[it[nameKey]] = it[nameValue], r),
            {} as Record<T[KN], T[VN]>
        )
    }

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

