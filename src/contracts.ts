
export type KeysOfType<T, ValueType> = {
  [K in keyof T]: T[K] extends ValueType ? K : never;
}[keyof T]
export type ValueOf<T> = T[keyof T];

export type Process<TEventCollection, TInput extends ValueOf<TEventCollection>> = (input: TInput, tool: ITool) => Promise<void>

export type ProcessMap<TEventCollection> = {
  [K in keyof TEventCollection]?: Array<Process<TEventCollection, TEventCollection[K]>>
}

export interface ITool {
  emit<TEventCollection, TInput extends ValueOf<TEventCollection>>(key: KeysOfType<TEventCollection, TInput>, input: TInput): Promise<void>;
  getStorage(): IStorage
}

export interface IEventCallbackRegistration {
  registerCallback(callback: (key: string, input: any) => Promise<void>): void;
}

export interface IEventCore {
  registerEventKeys(keys: string[]): void;  
  trigger(key: string, input: any): Promise<void>;
}
export interface IStorage {
  get<T>(key: string | number): Promise<T>;
  set<T>(key: string | number, item: T): Promise<T>;
}