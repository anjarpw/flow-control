import { IEventCore, ITool, KeysOfType, Process, ProcessMap, ValueOf } from "../contracts"

export class DirectEventCore<TEventCollection> implements IEventCore<TEventCollection> {
    private callbacks: Array<(key: keyof TEventCollection, input: ValueOf<TEventCollection>) => Promise<void>>

    constructor() {
        this.callbacks = []
    }
    registerCallback(callback: (key: keyof TEventCollection, input: ValueOf<TEventCollection>) => Promise<void>): void{
        this.callbacks.push(callback)        
    }

    async trigger<TInput extends ValueOf<TEventCollection>>(key: KeysOfType<TEventCollection, TInput>, input: TInput): Promise<void> {
        await Promise.all(this.callbacks.map(callback => callback(key, input)))
    }
}
