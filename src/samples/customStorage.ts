import { IStorage } from "../contracts";


export class CustomStorage implements IStorage {
    get<T>(key: string | number): Promise<T> {
        throw new Error("Method not implemented.");
    }
    set<T>(key: string | number, item: T): Promise<T> {
        throw new Error("Method not implemented.");
    }
}