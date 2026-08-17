import mitt from 'mitt'

const emitter = mitt()

const eventBus = {
  $on: (event, handler) => emitter.on(event, handler),
  $off: (event, handler) => emitter.off(event, handler),
  $emit: (event, ...args) => emitter.emit(event, ...args),
  $once: (event, handler) => {
    const wrap = (...args) => {
      emitter.off(event, wrap)
      handler(...args)
    }
    emitter.on(event, wrap)
  }
}

export default eventBus
