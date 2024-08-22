import { IEventCore, IStorage, ITool, KeysOfType, ValueOf } from "./contracts";

export class Tool<TEventCollection> implements ITool<TEventCollection> {
    protected core: IEventCore<TEventCollection>
    protected storage: IStorage
    constructor(core: IEventCore<TEventCollection>, storage: IStorage) {
        this.core = core;
        this.storage = storage
    }
    getStorage(): IStorage {
        return this.storage
    }
    async emit<TInput extends ValueOf<TEventCollection>>(key: KeysOfType<TEventCollection, TInput>, input: TInput): Promise<void> {
        this.core.trigger(key, input)
    }
}