const path = require('path');
//处理共用、通用的js
const webpack = require('webpack');
//css单独打包
const ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
	//入口文件
	entry: {
		main: './src/main',
		vendors: './src/vendors'
	},
	output: {
		path: path.join(__dirname, './dist')
	},
	module: {
		rules: [
			//vue单文件处理
			{
				test: /\.vue$/,
				use: [{
					//加载与编译vue文件
					loader: 'vue-loader',
					options: {
						loaders: {
							less: ExtractTextPlugin.extract({
								//minimize 启用压缩
								use: ['css-loader?minimize', 'autoprefixer-loader', 'less-loader'],
								//加载vue文件中的样式文件
								fallback: 'vue-style-loader'
							}),
							css: ExtractTextPlugin.extract({
								use: ['css-loader', 'autoprefixer-loader', 'less-loader'],
								//加载vue文件中的样式文件
								fallback: 'vue-style-loader'
							})
						}
					}
				}]
			},
			//iview文件夹下的js编译处理
			{
				test: /iview\/.*?js$/,
				//es6编译为es5
				loader: 'babel-loader'
			},
			//js编译处理
			{
				test: /\.js$/,
				loader: 'babel-loader',
				exclude: /node_modules/
			},
			//css处理
			{
				test: /\.css$/,
				use: ExtractTextPlugin.extract({
					//css-loader加载css样式文件,minimize 启用压缩
					use: ['css-loader?minimize', 'autoprefixer-loader'],
					//将样式表直接插入到页面的<style>内
					fallback: 'style-loader'
				})
			},
			//less处理
			{
				test: /\.less/,
				use: ExtractTextPlugin.extract({
					//less-loader编译与加载less文件(需要依赖less库)
					use: ['css-loader?minimize', 'autoprefixer-loader', 'less-loader'],
					fallback: 'style-loader'
				})
			},
			//图片处理
			{
				test: /\.(gif|jpg|png|woff|svg|eot|ttf)\??.*$/,
				loader: 'url-loader?limit=1024'
			},
			//实现资源复用
			{
				test: /\.(html|tpl)$/,
				loader: 'html-loader'
			}
		]
	},
	resolve: {
		//自动扩展文件后缀名，意味着我们require模块可以省略不写后缀名
		extensions: ['.js', '.vue'],
		//模块别名定义，方便后续直接引用别名，无须多写长长的地址
		alias: {
			'vue': 'vue/dist/vue.esm.js'
		}
	}
};
