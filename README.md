# Flow Control
Controlling a flow using step by step that is quite easy and intuitive to handle


## Sample of Simple Flow:

```ts

import { DirectEventCore, InMemoryStorage, generateEventManager, delayTime } from 'flow-control';


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
    for (let i = 1; i <= count; i++) {
      tool.emit('data', i)
    }
  })
  eventManager.on<number>(['data'], async (data, tool) => {
    dataCallback(data)
    for (let i = 1; i <= data; i++) {
      tool.emit('squared', i * i)
    }
  })
  eventManager.on<number>(['squared'], async (data, tool) => {
    squaredCallback(data)
  })
  eventManager.trigger<number>('count', 5)
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

```

it will output

```
count 5
data 1
squared 1
data 2
squared 1
squared 4
data 3
squared 1
squared 4
squared 9
data 4
squared 1
squared 4
squared 9
squared 16
data 5
squared 1
squared 4
squared 9
squared 16
squared 25

```



if we change the code a bit

```ts

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

```

and we get the history as follow

```ts
  const finalHistory = await inMemoryStorage.get('history')
  console.log(finalHistory)  
```


We will get

```
    [                                                                                                                                                         
      'count_5',   'data_1',
      'data_2',    'data_3',
      'data_4',    'data_5',
      'squared1',  'squared1',
      'squared4',  'squared1',
      'squared4',  'squared9',
      'squared1',  'squared4',
      'squared9',  'squared16',
      'squared1',  'squared4',
      'squared9',  'squared16',
      'squared25'
    ]
```

## Beyond A Single Running Process

We have other built in event cores, powered by rxjs and rabbitmq. By using rabbitMq, you could make the process available across different container

Also, for shared storage, we have memcached and redis as well


```ts

  // CORE options
  const rxjsEventCore = new RxjsEventCore()
  const rabbitMqService = new RabbitMqService('https://rabbitmq.myserver.com')
  rabbitMqService.connect()
  const rabbitMqEventCore = new RabbitMqEventCore(rabbitMqService)

  // STORAGE options
  const redisClient: RedisClientType = createClient({ url: 'https://redisclient.myserver.com' });
  redisClient.connect()
  const redisStorage = new RedisStorage(redisClient)

  const memcachedClient = new Memcached('memcached:11211');
  const memcachedStorage = new MemcachedStorage(memcachedClient, 3600)

  const eventManager = generateEventManager<Events>({
    core: rabbitMqEventCore, // OR rxjsEventCore
    storage: redisStorage // OR memcachedStorage
  })

```


## Custom Extension

You can implement the Core and Storage of your own

```ts

export interface IStorage {
  get<T>(key: string | number): Promise<T>;
  set<T>(key: string | number, item: T): Promise<T>;
}

export interface IEventCore {
  registerEventKeys(keys: string[]): void;  
  trigger(key: string, input: any): Promise<void>;
}

```


here is sample of custom core

```ts
import { IEventCallbackRegistration, IEventCore, BaseEventCore } from "flow-control";

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

```
here is sample of custom storage


```ts
import { IStorage } from "flow-control";


export class CustomStorage implements IStorage {
    get<T>(key: string | number): Promise<T> {
        throw new Error("Method not implemented.");
    }
    set<T>(key: string | number, item: T): Promise<T> {
        throw new Error("Method not implemented.");
    }
}

```