import commonjs from '@rollup/plugin-commonjs'
import typescript from 'rollup-plugin-typescript2'
import clear from 'rollup-plugin-delete'

export default [
    {
        input: 'src/index.ts',
        output: [
            {
                file: 'dist/index.js',
                format: 'cjs',
                sourcemap: true,
            },
        ],
        plugins: [
            commonjs(),
            typescript({
                tsconfigOverride: { compilerOptions: { module: 'es2015' } },
            }),
            clear({ targets: './dist' }),
        ],
    },
]
