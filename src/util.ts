const randomString = () =>
  Math.random()
    .toString(36)
    .substring(7)
    .split('')
    .join('.')

export const ActionTypes = {
  INIT: `@@store/INIT${randomString()}`,
  REPLACE: `@@store/REPLACE${randomString()}`,
  PROBE_UNKNOWN_ACTION: () => `@@store/PROBE_UNKNOWN_ACTION${randomString()}`,
}

export function getActionName(action: any): string {
  if (typeof action === 'string') return action

  try {
    const str = action.toString()
    const regAction = /return.*\.(.*)[;,}]/
    const arr: string[] = str.match(regAction) || []
    if (typeof arr[1] !== 'string') return ''
    return arr[1]
      .split(';')
      .join('')
      .trim()
  } catch {
    throw new Error('action type or selector invalid')
  }
}
