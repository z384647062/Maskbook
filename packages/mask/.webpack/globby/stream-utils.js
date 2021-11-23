Object.defineProperty(exports, '__esModule', { value: true })
exports.UniqueStream = exports.FilterStream = void 0
const node_stream_1 = require('stream')
class ObjectTransform extends node_stream_1.Transform {
    constructor() {
        super({
            objectMode: true,
        })
    }
}
class FilterStream extends ObjectTransform {
    constructor(filter) {
        super()
        this._filter = filter
    }
    _transform(data, encoding, callback) {
        if (this._filter(data)) {
            this.push(data)
        }
        callback()
    }
}
exports.FilterStream = FilterStream
class UniqueStream extends ObjectTransform {
    constructor() {
        super()
        this._pushed = new Set()
    }
    _transform(data, encoding, callback) {
        if (!this._pushed.has(data)) {
            this.push(data)
            this._pushed.add(data)
        }
        callback()
    }
}
exports.UniqueStream = UniqueStream
