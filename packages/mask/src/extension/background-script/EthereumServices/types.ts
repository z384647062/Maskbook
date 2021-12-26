import type Web3 from 'web3'
import type { HttpProvider } from 'web3-core'
import type { JsonRpcPayload, JsonRpcResponse } from 'web3-core-helpers'
import type { ChainId, ProviderType } from '@masknet/web3-shared-evm'

export interface Provider {
    createProvider(): HttpProvider
    createWeb3(): Web3
    requestAccounts(): Promise<{
        chainId: ChainId
        accounts: string[]
    }>
    ensureConnectedAndUnlocked: Promise<void>

    onAccountsChanged?(accounts: string[], providerType: ProviderType): Promise<void>
    onChainIdChanged?(id: string, providerType: ProviderType): Promise<void>
}

export interface Interceptor {
    encode?(payload: JsonRpcPayload): JsonRpcPayload
    decode?(error: Error | null, response?: JsonRpcResponse): [Error | null, JsonRpcResponse]
}
