// rollup.config.js
import resolve from 'rollup-plugin-node-resolve';
import babel from 'rollup-plugin-babel';
import replace from 'rollup-plugin-replace';

export default {
    entry: 'src/client/index.js',
    format: 'iife',
    plugins: [
        resolve(),
        babel({
            exclude: 'node_modules/**', // only transpile our source code
        }),
        replace({
            exclude: 'node_modules/**',
            ENV: JSON.stringify(process.env.ENV || 'development'),
        }),
    ],
    dest: 'dist/client.js', // equivalent to --output
};
