import { IEventCallbackRegistration, IEventCore, IStorage } from "../contracts";
import { BaseEventCore } from "../core";

export class CustomEventCore extends BaseEventCore implements IEventCore, IEventCallbackRegistration {
    registerEventKeys(keys: string[]): void {
        throw new Error('Method not implemented.');
    }
    trigger(key: string, input: any): Promise<void> {
        throw new Error('Method not implemented.');
    }
    constructor() {
        super()
    }
}
