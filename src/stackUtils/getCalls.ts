import { getGlobal } from './getGlobal'

export function getCalls () {
  const g = getGlobal()

  return g.__calls_stack__
}
