import type { PropType } from 'vue'

export function stringType<T extends string, P = string>(defaultVal?: P) {
  return {
    type: String as unknown as PropType<T>,
    default: defaultVal as P,
  }
}

export function numberType<T extends number, P = number>(defaultVal?: P) {
  return {
    type: Number as unknown as PropType<T>,
    default: defaultVal as P,
  }
}

export function booleanType<T extends boolean, P = boolean>(defaultVal?: P) {
  return {
    type: Boolean as unknown as PropType<T>,
    default: defaultVal as P,
  }
}

export function arrayType<T extends any[] = any[]>(defaultVal?: T) {
  return {
    type: Array as unknown as PropType<T>,
    default: defaultVal as T,
  }
}

export function objectType<T extends Record<string, any> = Record<string, any>>(defaultVal?: T) {
  return {
    type: Object as unknown as PropType<T>,
    default: defaultVal as T,
  }
}

export function functionType<T = () => any>(defaultVal?: T) {
  return {
    type: Function as unknown as PropType<T>,
    default: defaultVal as T,
  }
}

export function anyType<T = any>(defaultVal?: T, required?: boolean) {
  const type = { validator: () => true, default: defaultVal as T } as unknown
  return required
    ? (type as {
        type: PropType<T>
        default: T
        required: true
      })
    : (type as {
        default: T
        type: PropType<T>
      })
}

export function eventType<T>() {
  return { type: [Function, Array] as PropType<T> }
}
