const path = require("path"),
  webpack = require("webpack"),
  HTMLWebpackPlugin = require("html-webpack-plugin");
module.exports = {
  entry: {
    main: [
      // "babel-runtime/regenerator",
      "webpack-hot-middleware/client?reload=true", //ignored with heroku use only
      "./app/assets/scripts/index.js"
    ]
  },
  mode: "development",
  output: {
    filename: "[name]-bundle.js",
    path: path.resolve(__dirname, "../dist"),
    publicPath: ""
  },
  devServer: {
    contentBase: "dist",
    overlay: true,
    hot: true,
    stats: {
      colors: true
    }
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
            loader: "style-loader"
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
        test: /\.html$/,
        use: [
          {
            loader: "html-loader",
            options: {
              attrs: ["img:src"]
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
      },
      // {
      //   test: /\.png$/,
      //   use: ["url-loader?mimetype=image/png"]
      // }
      {
        test: /\.scss$/,
        use: [
          {
            loader: "style-loader" // creates style nodes from JS string
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
      }
    ]
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(), //ignored with heroku use only
    new HTMLWebpackPlugin({
      template: "./app/index.html",
      inject: true,
      title: "Trillo (Flexbox Training)"
    })
  ]
};
