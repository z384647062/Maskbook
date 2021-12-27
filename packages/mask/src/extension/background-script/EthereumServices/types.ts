import type Web3 from 'web3'
import type { RequestArguments } from 'web3-core'
import type { JsonRpcPayload, JsonRpcResponse } from 'web3-core-helpers'
import type { ChainId, ProviderType } from '@masknet/web3-shared-evm'

export interface Provider {
    createProvider(options?: ProviderOptions): Promise<ExternalProvider>
    createWeb3(options?: Web3Options): Promise<Web3>

    requestAccounts?(chainId?: ChainId): Promise<{
        chainId: ChainId
        accounts: string[]
    }>
    dismissAccounts?(chainId?: ChainId): Promise<void>

    ensureConnectedAndUnlocked?(): Promise<void>

    onAccountsChanged?(accounts: string[], providerType: ProviderType): Promise<void>
    onChainIdChanged?(id: string, providerType: ProviderType): Promise<void>
}

export interface Interceptor {
    encode?(payload: JsonRpcPayload): JsonRpcPayload
    decode?(error: Error | null, response?: JsonRpcResponse): [Error | null, JsonRpcResponse]
}

export interface ExternalProvider {
    request?: (requestArguments: RequestArguments) => Promise<any>
    send?: (payload: JsonRpcPayload, callback: (error: Error | null, response?: JsonRpcResponse) => void) => void
    sendAsync?: (payload: JsonRpcPayload, callback: (error: Error | null, response?: JsonRpcResponse) => void) => void
}

export interface ProviderOptions {
    chainId?: ChainId
    url?: string
}

export interface Web3Options {
    chainId?: ChainId
    keys?: string[]
    url?: string
}
