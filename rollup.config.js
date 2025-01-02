import babel from '@rollup/plugin-babel'
import typescript from '@rollup/plugin-typescript'
import path from 'path'
import alias from '@rollup/plugin-alias'
import commonjs from '@rollup/plugin-commonjs'
import image from '@rollup/plugin-image'
import peerDepsExternal from 'rollup-plugin-peer-deps-external'
import nodeResolve from '@rollup/plugin-node-resolve'
import terser from '@rollup/plugin-terser'
import pkg from './package.json' with { type: 'json' }

const extensions = ['.js', '.jsx', '.ts', '.tsx']
const __dirname = path.resolve()

export default {
  input: './src/index.ts', // 진입 경로
  output: [
    {
      format: 'cjs',
      file: pkg.main,
      sourcemap: true,
    },
    {
      format: 'esm',
      file: pkg.module,
      sourcemap: true,
    }
  ],
  external: ['react', 'react-dom'],
  plugins: [
    image(),
    peerDepsExternal(),
    nodeResolve({
      extensions,
    }),
    commonjs({
      include: 'node_modules/**'
    }),
    alias({
      entries: [{
        find: '@',
        replacement: path.resolve(__dirname, './src'),
      }],
    }),
    babel({
      exclude: /node_modules/,
      extensions,
      include: ['src/**/*'],
    }),
    typescript({
      tsconfig: './tsconfig.json',
    }),
    terser(),
  ],
}
