// @ts-check

const path = require('path');
const webpack = require('webpack');
// const HappyPack = require('happypack');
// const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');

/** @type {webpack.Configuration} */
module.exports =  {
    entry: './src/index.ts',
    output: {
        filename: 'build/bundle.js',
        path: path.resolve(__dirname)
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
        port: 8082,
        contentBase: '.',
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
