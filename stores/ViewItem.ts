import Api from 'stores/Api'

class ViewItem<T = any> extends Api {
    #data = { } as T

    constructor(
        private readonly type: string
    ) {
        super()
    }

    protected override onJson(data: api.View<T>) {
        this.#data = data.data ?? {} as T
    }

    async fetch(id: number) {
        return await this.call(`/api/${this.type}/${id}`)
    }

    get data() {
        return this.#data
    }
}


export default ViewItem