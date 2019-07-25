import typescript from 'rollup-plugin-typescript2'
import dts from 'rollup-plugin-dts'

import pkg from './package.json'

export default [{
  input: 'src/index.tsx',
  output: [
    {
      file: pkg.main,
      format: 'cjs',
      exports: 'named',
      sourcemap: true
    }
  ],
  external: ['immer', 'fast-deep-equal', 'gery', 'react', 'react-dom'],
  plugins: [
    typescript({
      rollupCommonJSResolveHack: true
    })
  ]
}, {
  input: 'dist/index.d.ts',
  output: [{ file: pkg.typings, format: 'cjs' }],
  plugins: [dts()]
}]
