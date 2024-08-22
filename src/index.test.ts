
import { DirectEventCore } from './core/directEventCore';
import { InMemoryStorage } from './storage/inMemoryStorage';
import { generateEventManager } from './eventManager';
import { delayTime } from '.';

test('Simple Flow', async () => {
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

  const countCallback = jest.fn(x => console.log("count", x));
  const dataCallback = jest.fn(x => console.log("data", x));
  const squaredCallback = jest.fn(x => console.log("squared", x));

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
   
  expect(countCallback).toHaveBeenCalledTimes(1)
  expect(countCallback).toHaveBeenCalledWith(5)

  expect(dataCallback).toHaveBeenCalledTimes(5)
  expect(dataCallback).toHaveBeenNthCalledWith(1, 1)
  expect(dataCallback).toHaveBeenNthCalledWith(2, 2)
  expect(dataCallback).toHaveBeenNthCalledWith(3, 3)
  expect(dataCallback).toHaveBeenNthCalledWith(4, 4)
  expect(dataCallback).toHaveBeenNthCalledWith(5, 5)

  expect(squaredCallback).toHaveBeenCalledTimes(15)
  expect(squaredCallback).toHaveBeenCalledWith(1)
  expect(squaredCallback).toHaveBeenCalledWith(4)
  expect(squaredCallback).toHaveBeenCalledWith(9)
  expect(squaredCallback).toHaveBeenCalledWith(16)
  expect(squaredCallback).toHaveBeenCalledWith(25)

});

