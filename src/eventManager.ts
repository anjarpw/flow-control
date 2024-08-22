import { IEventCallbackRegistration, IEventCore, IStorage, ITool, KeysOfType, Process, ProcessMap, ValueOf } from "./contracts"
import { Tool } from "./tool"
export type EventManagerCreationParams<TEventCollection> = {
    storage: IStorage
    core: IEventCore & IEventCallbackRegistration
}
export function generateEventManager<TEventCollection extends Record<string, any>>(params: EventManagerCreationParams<TEventCollection>): EventManager<TEventCollection> {
    const { core, storage } = params
    const tool = new Tool(core, storage)
    return new EventManager(core, tool, new ProcessCollector())
}

class ProcessCollector<TEventCollection> {
    private processMap: ProcessMap<TEventCollection>

    constructor() {
        this.processMap = {}
    }

    public runProcess<TInput extends ValueOf<TEventCollection>>(key: KeysOfType<TEventCollection, TInput>, input: TInput, tool: ITool) {
        const events = this.processMap[key] as Process<TEventCollection, TInput>[]
        events.forEach(e => {
            e(input, tool);
        })
    }
    public register<TInput extends ValueOf<TEventCollection>>(key: KeysOfType<TEventCollection, TInput>, process: Process<TEventCollection, TInput>) {
        if (!this.processMap[key]) {
            this.processMap[key] = []
        }
        (this.processMap[key] as Process<TEventCollection, TInput>[]).push(process)
    }

}


class EventManager<TEventCollection extends Record<string, any>> {
    private tool: ITool
    protected core: IEventCore & IEventCallbackRegistration
    processCollector: ProcessCollector<TEventCollection>

    constructor(core: IEventCore & IEventCallbackRegistration, tool: ITool, processCollector: ProcessCollector<TEventCollection>) {
        this.core = core
        this.tool = tool
        this.processCollector = processCollector
        core.registerCallback((key: keyof TEventCollection, input: ValueOf<TEventCollection>) => this.handleEvent(key, input))
    }

    private async handleEvent<TInput extends ValueOf<TEventCollection>>(key: KeysOfType<TEventCollection, TInput>, input: TInput) {
        this.processCollector.runProcess(key, input, this.tool)
    }

    on<TInput extends ValueOf<TEventCollection>>(keys: Array<KeysOfType<TEventCollection, TInput>>, process: Process<TEventCollection, TInput>) {
        this.core.registerEventKeys(keys as string[])
        keys.forEach(key => {
            this.processCollector.register(key, process)
        })
    }

    public trigger<TInput extends ValueOf<TEventCollection>>(key: KeysOfType<TEventCollection, TInput>, input: TInput) {
        this.core.trigger(key as string, input);
    }
}
