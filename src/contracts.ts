
export type KeysOfType<T, ValueType> = {
  [K in keyof T]: T[K] extends ValueType ? K : never;
}[keyof T];
export type ValueOf<T> = T[keyof T];

export type Process<TEventCollection, TInput extends ValueOf<TEventCollection>> = (input: TInput, tool: ITool<TEventCollection>) => Promise<void>

export type ProcessMap<TEventCollection> = {
  [K in keyof TEventCollection]?: Array<Process<TEventCollection, TEventCollection[K]>>
}

export interface ITool<TEventCollection> {
  emit<TInput extends ValueOf<TEventCollection>>(key: KeysOfType<TEventCollection, TInput>, input: TInput): Promise<void>;
  getStorage(): IStorage
}

export interface IToolGenerator<TEventCollection> {
  generate(core: IEventCore<TEventCollection>): ITool<TEventCollection>
}
export interface IEventCore<TEventCollection> {
  registerCallback(callback: (key: keyof TEventCollection, input: ValueOf<TEventCollection>) => Promise<void>): void;
  trigger<TInput extends ValueOf<TEventCollection>>(key: KeysOfType<TEventCollection, TInput>, input: TInput): Promise<void>;
}
export interface IStorage {
  get<T>(key: string | number): Promise<T>;
  set<T>(key: string | number, item: T): Promise<T>;
}