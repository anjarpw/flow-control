import { delayTime } from ".."
import { DirectEventCore } from "../core"
import { generateEventManager } from "../eventManager"
import { InMemoryStorage } from "../storage"

(async () => {


    const directEventCore = new DirectEventCore()
    const inMemoryStorage = new InMemoryStorage()

    type Events = {
        count: number
        data: number
        squared: number
    }

    const eventManager = generateEventManager<Events>({
        core: directEventCore,
        storage: inMemoryStorage
    })

    const countCallback = (x: number) => console.log("count", x);
    const dataCallback = (x: number) => console.log("data", x);
    const squaredCallback = (x: number) => console.log("squared", x);

    eventManager.on<number>(['count'], async (count, tool) => {
        countCallback(count)
        await tool.getStorage().set(`history`, [`count_${count}`])

        for (let i = 1; i <= count; i++) {
            tool.emit('data', i)
        }
    })
    eventManager.on<number>(['data'], async (data, tool) => {
        dataCallback(data)
        const history: string[] = await tool.getStorage().get<string[]>('history')
        history.push(`data_${data}`)
        await tool.getStorage().set(`history`, history)
        for (let i = 1; i <= data; i++) {
            tool.emit('squared', i * i)
        }
    })
    eventManager.on<number>(['squared'], async (squared, tool) => {
        squaredCallback(squared)
        const history: string[] = await tool.getStorage().get<string[]>('history')
        history.push(`squared${squared}`)
        await tool.getStorage().set(`history`, history)
    })

    eventManager.trigger<number>('count', 5)

    await delayTime(100)
    const finalHistory = await inMemoryStorage.get('history')
    console.log(finalHistory)

})()