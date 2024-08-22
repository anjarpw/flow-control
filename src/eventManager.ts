import { IEventCore, IStorage, ITool, IToolGenerator, KeysOfType, Process, ProcessMap, ValueOf } from "./contracts"
import { Tool } from "./tool"
export type EventManagerCreationParams<TEventCollection> = {
    storage: IStorage
    core: IEventCore<TEventCollection>
}
export function generateEventManager<TEventCollection>(params: EventManagerCreationParams<TEventCollection>): EventManager<TEventCollection> {
    const { core, storage } = params
    const tool = new Tool(core, storage)
    return new EventManager(core, tool)
}

class EventManager<TEventCollection> {
    private tool: ITool<TEventCollection>
    private processes: ProcessMap<TEventCollection>
    protected core: IEventCore<TEventCollection>

    constructor(core: IEventCore<TEventCollection>, tool: ITool<TEventCollection>) {
        this.core = core
        this.tool = tool
        this.processes = {}
        core.registerCallback((key: keyof TEventCollection, input: ValueOf<TEventCollection>) => this.handleEvent(key, input))
    }

    private async handleEvent<TInput extends ValueOf<TEventCollection>>(key: KeysOfType<TEventCollection, TInput>, input: TInput) {
        const events = this.processes[key] as Process<TEventCollection, TInput>[]
        events.forEach(e => {
            e(input, this.tool);
        })
    }

    public on<TInput extends ValueOf<TEventCollection>>(keys: Array<KeysOfType<TEventCollection, TInput>>, process: Process<TEventCollection, TInput>) {
        keys.forEach((key: KeysOfType<TEventCollection, TInput>) => {
            if (!this.processes[key]) {
                this.processes[key] = []
            }
            (this.processes[key] as Process<TEventCollection, TInput>[]).push(process)
        })
    }
    public trigger<TInput extends ValueOf<TEventCollection>>(key: KeysOfType<TEventCollection, TInput>, input: TInput) {
        this.core.trigger(key, input);
    }
}
