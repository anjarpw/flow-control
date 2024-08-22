import * as amqp from 'amqplib';
import { BaseEventCore } from './baseEventCore';
import { IEventCore } from '../contracts';

export class RabbitMQService {
    private connection?: amqp.Connection;
    private channel?: amqp.Channel;

    constructor(private url: string) { }

    async connect(): Promise<void> {
        this.connection = await amqp.connect(this.url);
        this.channel = await this.connection.createChannel();
    }

    async publish(queue: string, message: any): Promise<void> {
        await this.channel?.assertQueue(queue);
        this.channel?.sendToQueue(queue, Buffer.from(JSON.stringify(message)));
    }

    async consume(queue: string, callback: (message: any) => void): Promise<void> {
        await this.channel?.assertQueue(queue);
        this.channel?.consume(queue, (msg) => {
            if (msg !== null) {
                const message = JSON.parse(msg.content.toString());
                callback(message);
                this.channel?.ack(msg);
            }
        });
    }

    async close(): Promise<void> {
        await this.channel?.close();
        await this.connection?.close();
    }
}



export class EventCore extends BaseEventCore implements IEventCore {
    private rabbitMQService: RabbitMQService;

    constructor(rabbitMQService: RabbitMQService) {
        super()
        this.rabbitMQService = rabbitMQService;
    }

    async registerEventKeys(keys: string[]): Promise<void> {
        for (const key of keys) {
            await this.rabbitMQService.consume(key, async (message) => {
                await this.handleEvent(key, message);
            });
        }
    }

    async trigger(key: string, input: any): Promise<void> {
        await this.rabbitMQService.publish(key, input);
    }

    private async handleEvent(key: string, message: any): Promise<void> {
        console.log(`Event received for ${key}:`, message);
    }
}