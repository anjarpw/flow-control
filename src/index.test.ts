import { Tool } from './tool';
import { DirectEventCore } from './core/directEventCore';
import { InMemoryStorage } from './storage/inMemoryStorage';
import { generateEventManager } from './eventManager';


test('Simple Flow', async () => {
  const directEventCore = new DirectEventCore()
  const inMemoryStorage = new InMemoryStorage()

  type Events = {
    count: number
    data: number
    squared: number
  }

  const eventManager  = generateEventManager<Events>({
    core: directEventCore,
    storage: inMemoryStorage
  })

  const countCallback = jest.fn();
  const dataCallback = jest.fn();
  const squaredCallback = jest.fn();

  eventManager.on<number>(['count'], async (count, tool) => {
    countCallback(count)
    for(let i=0; i< count; i++){
      tool.emit('data', i)
    }
  })
  eventManager.on<number>(['data'], async (data, tool) => {
    dataCallback(data)
    for(let i=0; i< data; i++){
      tool.emit('squared', i*i)
    }
  })
  eventManager.on<number>(['squared'], async (data, tool) => {
    squaredCallback(data)
  })
  eventManager.trigger<number>('count', 5)
  expect(countCallback).toHaveBeenCalledTimes(1)
  expect(dataCallback).toHaveBeenCalledTimes(5)
  expect(squaredCallback).toHaveBeenCalledTimes(15)
  
});