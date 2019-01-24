export default function compose(...funcs: Array<(...args: any) => any>) {
  if (funcs.length === 0) {
    return (args: any) => args
  }

  if (funcs.length === 1) {
    return funcs[0]
  }

  return funcs.reduce((a, b) => (...args) => a(b(...args)))
}

export { compose }
