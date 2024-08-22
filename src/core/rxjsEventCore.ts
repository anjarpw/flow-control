import { Subject, Subscription } from 'rxjs';
import { BaseEventCore } from './baseEventCore';
import { IEventCallbackRegistration, IEventCore } from '../contracts';

export class SingleRxjsSubcriptionPerSubject {
    private subject: Subject<any>;
    subscription: Subscription;
    constructor(callback: (input: any) => void) {
        this.subject = new Subject<any>();
        this.subscription = this.subject.subscribe(callback);
    }
    public next(input: any) {
        this.subject.next(input);
    }
    public unsubscribe() {
        this.subscription.unsubscribe()
    }
}

export class RxjsEventCore extends BaseEventCore implements IEventCore, IEventCallbackRegistration {
    private subscriptionMap: Record<string, SingleRxjsSubcriptionPerSubject> = {}

    constructor() {
        super();
    }

    registerEventKeys(keys: string[]): void {
        for (const key of keys) {
            if (!this.subscriptionMap[key]) {
                this.subscriptionMap[key] = new SingleRxjsSubcriptionPerSubject(async (input: any) => {
                    await this.callback(key, input);
                })
            }
        }
    }

    async trigger(key: string, input: any): Promise<void> {
        const subscription = this.subscriptionMap[key];
        if (subscription) {
            subscription.next(input);
        } else {
            console.warn(`No subject registered for key: ${key}`);
        }
    }
}