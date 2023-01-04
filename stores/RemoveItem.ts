import Api from './Api'


class RemoveItem extends Api implements store.Remove {
    constructor(
        readonly type: ModelType,
        private id: number
    ) {
        super()
    }

    async remove() {
        return await this.call(
            '/api/remove', { id: this.id, type: this.type }, 'DELETE'
        )
    }
}


export default RemoveItem