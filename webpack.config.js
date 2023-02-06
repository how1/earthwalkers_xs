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
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

process.env.NODE_ENV = process.env.NODE_ENV || 'development';

if (process.env.NODE_ENV === 'development'){
	require('dotenv').config({ path: '.env.development'});
}


module.exports = (env) => {
	const isProduction = env === 'production';

	return ({
		entry: ['babel-polyfill', './src/app.js'],
		output: {
			path: path.join(__dirname, 'public'),
			filename: 'bundle.js'
		},
		resolve:{
			fallback: {
				"fs" : false
			}
		},
		experiments: {
			topLevelAwait: true
		},
		module: {
			rules: [{
				loader: 'babel-loader',
				test: /\.js$/,
				exclude: /node_modules/
			}, {
				test: /\.s?css$/,
				use: [
					MiniCssExtractPlugin.loader,
					"css-loader",
					"sass-loader"
				]
			}, {
			    test: /\.(jpe?g|gif|png|svg)$/i,
			    use: {
			      loader: 'url-loader',
			      options: {
			        limit: 10000
			      }
			    }
			}, {
				test: /\.txt$/,
				use: {
					loader: 'raw-loader'
				}
			}, {
			    test: /\.ogg$/,
			    use: {
			    	loader: 'file-loader',
			    	 options: {
				        esModule: false 
				      }
			    }
			}]
		},
		plugins: [
    new MiniCssExtractPlugin({
      attributes: {
        id: "target",
        "data-target": "example",
      },
    }),
  ],
		devtool: isProduction ? 'source-map' : 'eval-cheap-module-source-map',// 'inline-source-map',
		devServer: {
			static: {
      			directory: path.join(__dirname, "./public")
    		}
		},
		node: {
    		global: true,
 			__filename: true,
 			__dirname: true,
  		}
	});
}