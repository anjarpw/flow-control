import { IEventCore, ITool, KeysOfType, Process, ProcessMap, ValueOf } from "../contracts"

export class DirectEventCore implements IEventCore {
    private callback: (key: string, input: any) => Promise<void>

    constructor() {
        this.callback = async (key, value) => { }
    }
    registerEventKeys(keys: string[]): void {
    }

    registerCallback(callback: (key: string, input: any) => Promise<void>): void {
        this.callback = callback
    }

    async trigger(key: string, input: any): Promise<void> {
        await this.callback(key, input)
    }
}
