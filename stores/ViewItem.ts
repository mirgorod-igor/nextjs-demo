import Api from 'stores/Api'

class ViewItem<T> extends Api {
    #data = { } as T

    constructor(
        private readonly type: string
    ) {
        super()
    }

    protected override onJson(data: api.View<T>) {
        this.#data = data.data ?? {} as T
    }

    async fetch(id: number, args?) {
        const params = args
            ? '?'+Object.keys(args).map(key => `${key}=${args[key]}`).join('&')
            : ''
        return await this.call(`/api/${this.type}/${id}${params}`)
    }

    get data(): T {
        return this.#data
    }
}


export default ViewItem