//处理共用、通用的js
const webpack = require('webpack');
//处理html模板
const HtmlWebpackPlugin = require('html-webpack-plugin');
//css单独打包
const ExtractTextPlugin = require('extract-text-webpack-plugin');
//合并配置
const merge = require('webpack-merge');
const webpackBaseConfig = require('./webpack.base.config.js');
//fs模块用于对系统文件及目录进行读写操作
const fs = require('fs');
//编译前用node生成一个env.js的文件，用来标明当前是开发（development）还是生产环境（production）
fs.open('./src/config/env.js', 'w', function(err, fd) {
	const buf = 'export default "development";';
	fs.write(fd, buf, 0, buf.length, 0, function(err, written, buffer) {});
});

module.exports = merge(webpackBaseConfig, {
	//打包代码的同时生成一个sourcemap文件，并在打包文件的末尾添加//# souceURL，注释会告诉JS引擎原始文件位置
	devtool: '#source-map',
	output: {
		//线上环境路径
		publicPath: '/dist/',
		filename: '[name].js',
		chunkFilename: '[name].chunk.js'
	},
	plugins: [
		//css单独打包
		new ExtractTextPlugin({
			filename: '[name].css',
			allChunks: true
		}),
		//通用模块编译
		new webpack.optimize.CommonsChunkPlugin({
			//提取的公共块的块名称（chunk）
			name: 'vendors',
			//生成的通用的文件名
			filename: 'vendors.js'
		}),
		new HtmlWebpackPlugin({
			//输出文件
			filename: '../index.html',
			//模板文件
			template: './src/template/index.ejs',
			//不插入生成的 js 文件，只是单纯的生成一个 html 文件
			inject: false
		})
	]
});