import { IStorage } from "../contracts";

export class InMemoryStorage implements IStorage{
    memory: Record<string | number, any>
    constructor(){
        this.memory = {}
    }

    async get<T>(key: string | number): Promise<T> {
        return this.memory[key] as T
    }
    async set<T>(key: string | number, item: T): Promise<T> {
        this.memory[key] = item
        return this.get(key)
    }

}