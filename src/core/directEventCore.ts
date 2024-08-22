import { IEventCore, ITool, KeysOfType, Process, ProcessMap, ValueOf } from "../contracts"
import { BaseEventCore } from "./baseEventCore"

export class DirectEventCore extends BaseEventCore implements IEventCore {
 
    constructor() {
        super()
    }
    registerEventKeys(keys: string[]): void {
    }
    async trigger(key: string, input: any): Promise<void> {
        await this.callback(key, input)
    }
}
