/* eslint-disable @typescript-eslint/no-require-imports */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable no-undef */
const path = require('path');

const CopyPlugin = require('copy-webpack-plugin');
const HtmlPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
	entry: {
		popup: path.resolve('src/popup/index.tsx'),
		options: path.resolve('src/options/index.tsx'),
		sidepanel: path.resolve('src/sidepanel/index.tsx'),
		highlights: path.resolve('src/content-scripts/highlights/index.tsx'),
		tabs: path.resolve('src/tabs/index.tsx'),
		service_worker: path.resolve('src/service-worker/index.ts'),
	},
	module: {
		rules: [
			{
				use: 'ts-loader',
				test: /\.(tsx|ts)$/,
				exclude: /node_modules/,
			},
			{
				test: /\.s[ac]ss$/i,
				use: ['style-loader', 'css-loader', 'sass-loader'],
				exclude: [/\.shadow-dom.scss$/, /node_modules/],
			},
			{
				test: /\.shadow-dom.scss$/,
				exclude: /node_modules/,
				use: [
					'sass-to-string',
					{
						loader: 'sass-loader',
						options: {
							sassOptions: {
								outputStyle: 'compressed',
							},
						},
					},
				],
			},
			{
				type: 'assets/resource',
				test: /\.(png|jpg|jpeg|gif|woff|woff2|tff|eot|svg)$/,
			},
			{
				test: /\.css$/i,
				use: [
					'style-loader',
					{
						loader: 'css-loader',
						options: {
							importLoaders: 1,
						},
					},
				],
			},
		],
	},
	plugins: [
		new CleanWebpackPlugin({
			cleanStaleWebpackAssets: false,
		}),
		new CopyPlugin({
			patterns: [
				{
					from: path.resolve('src/static'),
					to: path.resolve('../../dist/apps/highlight-extension-fe'),
				},
			],
		}),
		...getHtmlPlugins(['popup', 'options', 'tabs', 'sidepanel']),
	],
	resolve: {
		modules: [path.resolve(__dirname, '../../'), 'node_modules'],
		alias: {
			// Apps
			'~/highlight-extension-fe': path.resolve(__dirname, '../../apps/highlight-extension-fe/src'),
			// Libs
			'~libs/common': path.resolve(__dirname, '../../libs/common/src'),
			'~libs/dto': path.resolve(__dirname, '../../libs/dto/src'),
			'~libs/express-core': path.resolve(__dirname, '../../libs/express-core/src'),
			'~libs/ro': path.resolve(__dirname, '../../libs/ro/src'),
			'~libs/routes': path.resolve(__dirname, '../../libs/routes/src'),
		},
		extensions: ['.js', '.ts', '.tsx'],
	},
	output: {
		filename: '[name].js',
		path: path.join(__dirname, '../../dist/apps/highlight-extension-fe'),
	},
	optimization: {
		splitChunks: {
			chunks(chunk) {
				switch (chunk.name) {
					case 'highlights':
						return false;
					default:
						return true;
				}
			},
		},
	},
};

function getHtmlPlugins(chunks) {
	return chunks.map(
		(chunk) =>
			new HtmlPlugin({
				title: 'React Extension',
				filename: `${chunk}.html`,
				chunks: [chunk],
			})
	);
}
