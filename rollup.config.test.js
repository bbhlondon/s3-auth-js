// rollup.config.js
import resolve from 'rollup-plugin-node-resolve';
import babel from 'rollup-plugin-babel';
// import commonjs from 'rollup-plugin-commonjs';

export default {
    entry: 'src/worker/storage.test.js',
    format: 'umd',
    plugins: [
        resolve({
            jsnext: true,
            main: true,
            browser: true,
        }),
        babel({
            exclude: 'node_modules/**', // only transpile our source code
        }),
    ],
    dest: './tests/bundle.js'
};
