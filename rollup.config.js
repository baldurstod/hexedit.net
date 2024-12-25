import { nodeResolve } from '@rollup/plugin-node-resolve';
import copy from 'rollup-plugin-copy';
import css from 'rollup-plugin-import-css';
import typescript from '@rollup/plugin-typescript';

export default [
	{
		input: './src/client/ts/application.ts',
		output: {
			file: './dist/js/application.js',
			format: 'esm'
		},
		plugins: [
			css(),
			typescript(),
			nodeResolve(),
			copy({
				copyOnce: true,
				targets: [
					{src: 'src/index.html', dest: 'dist/'},
				]
			}),
		],
	},
];
