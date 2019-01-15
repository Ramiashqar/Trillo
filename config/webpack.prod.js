const path = require("path"),
  webpack = require("webpack"),
  HTMLWebpackPlugin = require("html-webpack-plugin"),
  miniCSSExtractPlugin = require("mini-css-extract-plugin"),
  optimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin"),
  minifyPlugin = require("babel-minify-webpack-plugin"),
  PurifyCSSPlugin = require('purifycss-webpack'),
  glob = require('glob-all'),
  // compressionPlugin = require("compression-webpack-plugin"),
  // brotliPlugin = require("brotli-webpack-plugin"),
  CleanWebpackPlugin = require("clean-webpack-plugin"),
  DelWebpackPlugin = require("del-webpack-plugin");
module.exports = env => {
  return {
    entry: {
      main: ["./app/assets/scripts/index.js"]
    },
    mode: "production",
    output: {
      filename: "[name]-bundle.js",
      path: path.resolve(__dirname, "../dist"),
      publicPath: ""
    },
    module: {
      rules: [
        {
          test: /\.(js|jsx)$/,
          exclude: /node_modules/,
          use: [
            {
              loader: "babel-loader"
            }
          ],
          exclude: /node_modules/
        },
        {
          test: /\.css$/,
          use: [
            {
              loader: miniCSSExtractPlugin.loader
            },
            {
              loader: "css-loader",
              options: {
                url: true
              }
            }
          ]
        },
        {
          test: /\.scss$/,
          use: [
            {
              loader: miniCSSExtractPlugin.loader // creates style nodes from JS string
            },
            {
              loader: "css-loader" // translates CSS into CommonJS
            },
            {
              loader: "postcss-loader"
            },
            {
              loader: "fast-sass-loader"
            }
          ]
        },
        {
          test: /\.html$/,
          use: [
            {
              loader: "html-loader",
              options: {
                attrs: ["img:src"],
                minimize: true
              }
            }
          ]
        },
        {
          test: /\.(png|jpg|svg|gif|jpeg)$/,
          use: [
            {
              loader: "file-loader",
              options: {
                name: "assets/images/[name].[ext]"
              }
            }
          ]
        }
      ]
    },
    plugins: [
      new CleanWebpackPlugin(["dist"], {
        root: path.join(__dirname, "..")
      }),
      new miniCSSExtractPlugin({
        filename: "app-[contenthash].css"
      }),
      new PurifyCSSPlugin({
        paths: glob.sync([
            path.join(__dirname, '../app/index.html'),
            path.join(__dirname, '../app/assets/scripts/index.js')
        ]),
        minimize: true,
        purifyOptions: {
            whitelist: []
        }
    }),
      new optimizeCSSAssetsPlugin({
        assetNameRegExp: /\.css$/g,
        cssProcessor: require("cssnano"),
        cssProcessorOptions: {
          discardComments: {
            removeAll: true
          }
        },
        canPrint: true
      }),

      new webpack.DefinePlugin({
        "process.env": {
          NODE_ENV: JSON.stringify(env.NODE_ENV)
        }
      }),
      new HTMLWebpackPlugin({
        template: "./app/index.html",
        inject: true,
        title: "Webpack Setup"
      }),
      new minifyPlugin(),
      // new compressionPlugin({
      //   algorithm: "gzip"
      // }),
      // new brotliPlugin(),
      new DelWebpackPlugin({
        //here I'm using it just to show all the built files in a much readable matter
        include: ["dist/trash"],
        info: true,
        keepGeneratedAssets: true,
        allowExternal: true
      })
    ]
  };
};
