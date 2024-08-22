import { createClient, RedisClientType } from "redis"
import { RabbitMqEventCore, RabbitMqService, RxjsEventCore } from "../core"
import { MemcachedStorage, RedisStorage } from "../storage"
import Memcached from "memcached"
import { generateEventManager } from "../eventManager"

type Events = {
  count: number
  data: number
  squared: number
}

(async () => {

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

})()
