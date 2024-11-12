/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-require-imports */
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
				type: 'assets/imgs',
				test: /\.(png|jpg|jpeg|gif|woff|woff2|tff|eot)$/,
			},
			{
				type: 'assets/imgs',
				test: /\.svg$/,
				use: ['@svgr/webpack'],
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
		alias: {
			// Apps
			'~/highlight-extension-fe': path.resolve(__dirname, '../../apps/highlight-extension-fe/src'),
			// Libs
			'~libs/client-core': path.resolve(__dirname, '../../libs/client-core/src'),
			'~libs/common': path.resolve(__dirname, '../../libs/common/src'),
			'~libs/dto': path.resolve(__dirname, '../../libs/dto/src'),
			'~libs/react-core': path.resolve(__dirname, '../../libs/react-core/src'),
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
