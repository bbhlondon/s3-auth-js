// rollup.config.js
import resolve from 'rollup-plugin-node-resolve';
import babel from 'rollup-plugin-babel';

export default {
    entry: 'src/client/index.js',
    format: 'iife',
    moduleName: 'client',
    plugins: [
        resolve(),
        babel({
            exclude: 'node_modules/**', // only transpile our source code
        }),
    ],
    dest: 'dist/client.js', // equivalent to --output
};
