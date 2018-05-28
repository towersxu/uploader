import postcss from 'rollup-plugin-postcss'
import babel from 'rollup-plugin-babel';
import serve from 'rollup-plugin-serve';
import livereload from 'rollup-plugin-livereload';
import eslint from 'rollup-plugin-eslint';
import nodeResolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import {
  uglify
} from 'rollup-plugin-uglify';

export default {
  input: 'src/index.js',
  output: {
    file: 'dist/uploader.js',
    format: 'umd',
    name: 'Uploader'
  },
  watch: {
    include: 'src/**',
    clearScreen: false
  },
  plugins: [
    eslint(),
    postcss({
      plugins: []
    }),
    nodeResolve({
      module: true
    }),
    commonjs(),
    babel({
      exclude: 'node_modules/**'
    }),
    serve(), // index.html should be in root of project
    livereload({
      watch: 'dist'
    })
  ]
}