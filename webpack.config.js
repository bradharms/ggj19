// @ts-check

const path = require('path');
const webpack = require('webpack');
// const HappyPack = require('happypack');
// const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');

/** @type {webpack.Configuration} */
module.exports =  {
    mode: 'development',
    entry: './src/index.ts',
    output: {
        filename: 'bundle.js',
        path: path.resolve('./dist')
    },
    devtool: "eval-source-map",
    module: {
        rules: [
            {
                test: /.*\.(t|j)s$/,
                exclude: /node_modules/,
                use: ['ts-loader']
            },
            {
                test: /.*\.css$/,
                use: ['style-loader', 'css-loader']
            }
        ],
    },
    resolve: {
        modules: ['./src', './node_modules'],
        extensions: ['.js', '.ts']
    },
    devServer: {
        hot: true,
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        // new HappyPack({
        //     loaders: [
        //         {
        //             loader: 'ts-loader',
        //             query: {
        //                 happyPackMode: true,
        //             }
        //         }
        //     ]
        // }),
        // new ForkTsCheckerWebpackPlugin()
    ]
};
