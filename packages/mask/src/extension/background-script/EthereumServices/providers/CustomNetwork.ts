import { ChainId } from '@masknet/web3-shared-evm'
import type types from 'web3'
import type { RequestArguments } from 'web3-core'
import type { JsonRpcPayload, JsonRpcResponse } from 'web3-core-helpers'
import type { Provider } from '../types'

export function createWeb3() {
    throw new Error('To be implemented.')
}

export async function requestAccounts() {
    return {
        accounts: [],
        chainId: ChainId.Mainnet,
    }
}

export class CustomNetworkProvider implements Provider {
    createProvider(): Promise<{
        request: (requestArguments: RequestArguments) => Promise<any>
        send: (payload: JsonRpcPayload, callback: (error: Error | null, response?: JsonRpcResponse) => void) => void
    }> {
        throw new Error('Method not implemented.')
    }
    createWeb3(): Promise<types> {
        throw new Error('Method not implemented.')
    }
    ensureConnectedAndUnlocked?: Promise<void> | undefined
    requestAccounts(): Promise<{ chainId: ChainId; accounts: string[] }> {
        return Promise.resolve({
            accounts: [],
            chainId: ChainId.Mainnet,
        })
    }
}
