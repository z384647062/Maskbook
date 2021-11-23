Error.stackTraceLimit = Infinity
const old = setTimeout
const old2 = clearTimeout
class Timer {
    #id: number
    constructor(callback: Function, timeout: number) {
        this.#id = old(callback, timeout)
    }
    close() {
        old2(this.#id)
    }
    unref() {}
    [Symbol.toPrimitive]() {
        return this.#id
    }
}

globalThis.setTimeout = (callback, timeout) => new Timer(callback, timeout)
globalThis.clearTimeout = (number) => {
    if (typeof number === 'number') old2(number)
    number.close()
}
