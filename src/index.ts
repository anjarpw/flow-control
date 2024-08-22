export * from './contracts'
export * from './eventManager'
export * from './tool'
export * from './core'
export * from './storage'

export async function delayTime(duration: number){
    return new Promise<void>((resolve) => {
        setTimeout(() => resolve())
    })
}