import { JsonRpcPayload, JsonRpcResponse } from 'web3-core-helpers'
import { Interceptor } from '../types'

export class CeloInterceptor implements Interceptor {
    encode(payload: JsonRpcPayload): JsonRpcPayload {
        throw new Error('Method not implemented.')
    }
    decode(error: unknown, response?: JsonRpcResponse): [unknown, JsonRpcResponse] {
        throw new Error('Method not implemented.')
    }
}
