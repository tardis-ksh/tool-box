import path from 'node:path';

const config = {
	format: ['esm'],
	dts: false, // 生成 .d.ts 声明文件
	sourcemap: false,
	clean: true, // 构建前清理输出目录
	minify: true, // 压缩代码
	bundle: true, // 启用代码打包
	outDir: 'dist',
	entry: ['index.ts'],
	target: 'esnext',
	
	esbuildOptions: (options) => {
		options.alias = {
			'@': path.resolve(process.cwd(), 'src'),
		};
	},
}

export default config;
