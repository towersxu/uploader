import postcss from 'rollup-plugin-postcss'
import babel from 'rollup-plugin-babel';
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
    babel({
      exclude: 'node_modules/**'
    }),
    uglify()
  ]
}