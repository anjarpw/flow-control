import { IEventCore, ITool, KeysOfType, Process, ProcessMap, ValueOf, IEventCallbackRegistration } from '../contracts';

export abstract class BaseEventCore implements IEventCore, IEventCallbackRegistration {
    protected callback: (key: string, input: any) => Promise<void>

    constructor() {
        this.callback = async (key, value) => { }
    }
    registerCallback(callback: (key: string, input: any) => Promise<void>): void {
        this.callback = callback
    }
    abstract registerEventKeys(keys: string[]): void;
    abstract trigger(key: string, input: any): Promise<void>;
}



