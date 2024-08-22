import { IEventCore, IStorage, ITool, KeysOfType, ValueOf } from "./contracts";

export class Tool implements ITool {
    protected core: IEventCore
    protected storage: IStorage
    constructor(core: IEventCore, storage: IStorage) {
        this.core = core;
        this.storage = storage
    }
    getStorage(): IStorage {
        return this.storage
    }
    async emit<TEventCollection, TInput extends ValueOf<TEventCollection>>(key: KeysOfType<TEventCollection, TInput>, input: TInput): Promise<void> {
        this.core.trigger(key as string, input)
    }
}