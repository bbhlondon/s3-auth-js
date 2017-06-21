// rollup.config.js
import resolve from 'rollup-plugin-node-resolve';
import babel from 'rollup-plugin-babel';

export default {
    entry: 'src/worker/index.js',
    format: 'umd',
    moduleName: 'worker',
    plugins: [
        resolve(),
        babel({
            exclude: 'node_modules/**', // only transpile our source code
        }),
    ],
    dest: 'dist/worker.js', // equivalent to --output
};
