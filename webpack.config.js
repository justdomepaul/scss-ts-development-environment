const path = require('path');
const webpack = require("webpack");
const node_modules = path.resolve(__dirname, "node_modules");

const TerserPlugin = require('terser-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const ManifestPlugin = require('webpack-manifest-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const ExtractTextObjectPlugin = new ExtractTextPlugin({
    filename: "./css/[name].css",
    allChunks: true
});

const config = {
    optimization: {
        minimize: true,
        minimizer: [new TerserPlugin()],
        runtimeChunk: {
            name: "manifest"
        },
        splitChunks: {
            cacheGroups: {
                commons: {
                    test: /[\\/]node_modules[\\/]/,
                    name: "vendor",
                    chunks: "all"
                }
            }
        }
    },
    entry: {
        // v1 new version
        base: "./src/scss/v1/base.scss",
        ent: "./src/ts/v1/ent.ts",
    },
    output: {
        path: path.join(__dirname, "./dist"),
        filename: '[name].bundle.js',
        // publicPath: "../",
        // server的導入路徑
        // filename: "js/[name]/[name].js"
        // [name] 會依據上面 entry 的屬性名稱變動
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                loader: 'ts-loader',
                exclude: /node_modules/,
            },
            {
                test: /(\.css|\.scss)$/,
                loader: ExtractTextObjectPlugin.extract({
                    fallback: 'style-loader',
                    // loader: 'css-loader!sass-loader'
                    use: [
                        {
                            loader: "css-loader"
                        },
                        {
                            loader: "sass-loader"
                        }
                    ]
                })
            },
            {
                test: /\.eot(\?[\s\S]+)?$/,
                loader: "file-loader?prefix=font/&name=fonts/[name].[ext]"
            },
            {
                test: /\.(woff|woff2)(\?[\s\S]+)?$/,
                loader: "url-loader?prefix=font/&limit=15000&name=fonts/[name].[ext]"
            },
            {
                test: /\.ttf(\?[\s\S]+)?$/,
                loader: "url-loader?prefix=font/limit=15000&mimetype=application/octet-stream&name=fonts/[name].[ext]"
            },
            {
                test: /\.svg(\?[\s\S]+)?$/,
                loader: "url-loader?prefix=font/limit=15000&mimetype=image/svg+xml&name=fonts/[name].[ext]"
            },
            {
                test: /\.gif/,
                loader: "url-loader?limit=15000&mimetype=image/gif&name=images/[name].[ext]"
            },
            {
                test: /\.jpg/,
                loader: "url-loader?limit=15000&mimetype=image/jpg&name=images/[name].[ext]"
            },
            {
                test: /\.png/,
                loader: "url-loader?limit=15000&mimetype=image/png&name=images/[name].[ext]"
            },
            {
                test: /\.(png!jpg)$/,
                loader: "file-loader?name=image/[name].[ext]"
            }
        ]
    },
    devtool: "eval-source-map",
    resolve: {
        // alias: {
        // },
        modules: [path.resolve(__dirname, './node_modules')],
        extensions: [".tsx", ".ts", ".js"]
    },
    //To run development server
    devServer: {
        // contentBase: path.join(__dirname, "dist"),
        index: 'index.html',
        hot: true,
        inline: false,
    },
    plugins: [ExtractTextObjectPlugin, new ManifestPlugin(), new CleanWebpackPlugin(), new HtmlWebpackPlugin({
        title: '管理输出'
    }),]
};

if (process.env.NODE_ENV === "production") {
    config.devtool = "source-map";
}

module.exports = config;
