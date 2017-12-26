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
fs.open('./src/config/env.js', 'w', function (err, fd) {
    const buf = 'export default "production";';
    fs.write(fd, buf, 0, buf.length, 0, function (err, written, buffer){});
});

module.exports = merge(webpackBaseConfig, {
    output: {
    	//线上环境路径
        publicPath: 'dist/',
        filename: '[name].[hash].js',
        chunkFilename: '[name].[hash].chunk.js'
    },
    plugins: [
        new ExtractTextPlugin({
        	//css单独打包
            filename: '[name].[hash].css',
            allChunks: true
        }),
        //通用模块编译
        new webpack.optimize.CommonsChunkPlugin({
        	//提取的公共块的块名称（chunk）
            name: 'vendors',
            //生成的通用的文件名
            filename: 'vendors.[hash].js'
        }),
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: '"production"'
            }
        }),
        //js压缩
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false
            }
        }),
        
        new HtmlWebpackPlugin({
        	//输出文件
            filename: '../index_prod.html',
            //模板文件
            template: './src/template/index.ejs',
            //不插入生成的 js 文件，只是单纯的生成一个 html 文件
            inject: false
        })
    ]
});