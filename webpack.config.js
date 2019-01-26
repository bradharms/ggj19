// @ts-check

const path = require('path');
const webpack = require('webpack');

/** @type {webpack.Configuration} */
module.exports =  {
    mode: 'development',
    entry: './src/index.ts',
    output: {
        filename: 'bundle.js',
        path: path.resolve('./dist')
    },
    module: {
        rules: [
            {
                test: /.*\.(t|j)s$/,
                use: ['ts-loader']
            }
        ],
    },
    resolve: {
        modules: ['./src', './node_modules']
    },
    devServer: {
        hot: true,
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin()
    ]
};
