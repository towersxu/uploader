import postcss from 'rollup-plugin-postcss'
import babel from 'rollup-plugin-babel';
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
  plugins: [
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
    uglify()
  ]
}