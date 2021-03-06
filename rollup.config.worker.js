// rollup.config.js
import resolve from 'rollup-plugin-node-resolve';
import babel from 'rollup-plugin-babel';
import replace from 'rollup-plugin-replace';
import json from 'rollup-plugin-json';
import commonjs from 'rollup-plugin-commonjs';

export default {
    entry: 'src/worker/index.js',
    format: 'umd',
    moduleName: 'worker',
    plugins: [
        json({
            include: './config.json',
            preferConst: true,
        }),
        resolve(),
        commonjs({
            include: 'node_modules/crypto-js/**',
        }),
        babel({
            exclude: 'node_modules/**', // only transpile our source code
        }),
        replace({
            exclude: 'node_modules/**',
            ENV: JSON.stringify(process.env.ENV || 'development'),
        }),
    ],
    dest: 'dist/worker.js', // equivalent to --output
};
