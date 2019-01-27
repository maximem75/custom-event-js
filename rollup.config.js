import clear from 'rollup-plugin-clear';
import babel from 'rollup-plugin-babel';
import cjs from 'rollup-plugin-commonjs';
import resolve from 'rollup-plugin-node-resolve';
import css from 'rollup-plugin-css-only';

export default {
  input: 'example/example.js',
  output: {
    name: 'index',
    file: 'dist/index.js',
    format: 'iife',
  },
  watch: {
    include: ['/**']
  },
  plugins: [
    clear({ targets: ['dist'] }),
    css({ output: 'dist/style.css' }),
    cjs(),
    resolve(),
    babel({
      presets: [['env', { modules: false } ]],
      plugins: ['external-helpers']
    })
  ]
}