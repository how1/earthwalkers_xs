// const path = require('path');

// module.exports = {
// 	entry: './src/app.js',
// 	output: {
// 		path: path.join(__dirname, 'public'),
// 		filename: 'bundle.js'
// 	},
// 	module: {
// 		rules: [{
// 			loader: 'babel-loader',
// 			test: /\.js$/,
// 			exclude: /node_modules/
// 		}, {
// 			test: /\.s?css$/,
// 			use: [
// 				"style-loader",
// 				"css-loader",
// 				"sass-loader"
// 			]
// 		}]
// 	},
// 	devtool: 'cheap-module-eval-source-map',
// 	devServer: {
// 		contentBase: path.join(__dirname, 'public')
// 	}
// };


const path = require('path');
const webpack = require('webpack')
const ExtractTextPlugin = require('extract-text-webpack-plugin');

process.env.NODE_ENV = process.env.NODE_ENV || 'development';

if (process.env.NODE_ENV === 'development'){
	require('dotenv').config({ path: '.env.development'});
}


module.exports = (env) => {
	const isProduction = env === 'production';
	const CSSExtract = new ExtractTextPlugin('styles.css');

	return ({
		entry: ['babel-polyfill', './src/app.js'],
		output: {
			path: path.join(__dirname, 'public'),
			filename: 'bundle.js'
		},
		module: {
			rules: [{
				loader: 'babel-loader',
				test: /\.js$/,
				exclude: /node_modules/
			}, {
				test: /\.s?css$/,
				use: [
					"style-loader",
					"css-loader",
					"sass-loader"
				]
			}]
		},
		plugins: [
			CSSExtract
		],
		devtool: isProduction ? 'source-map' : 'cheap-module-eval-source-map',// 'inline-source-map',
		devServer: {
			contentBase: path.join(__dirname, 'public'),
			historyApiFallback: true
		},
		node: {
    		fs: "empty"
  		}
	});
}