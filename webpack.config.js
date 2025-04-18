/**
 * One Webpack config for both dev and production.
 * Has support for Es6+ using Babel and Sass.
 * Also works with React.
 * Uses Webpack Dev Server in development for hot reloading.
 *
 * Put Babel settings in a separate file called .babelrc
 *
 * Script to build: NODE_ENV=production webpack
 * Script to dev: webpack-dev-server --open --hot --inline
 */

const { merge } = require("webpack-merge");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const InterpolateHtmlPlugin = require("interpolate-html-plugin");
const path = require("path");
const Dotenv = require("dotenv-webpack");
const packagejson = require("./package.json");

const production = process.env.NODE_ENV === "production";

// file names of bundles
const jsBundleName = "app.bundle.js";
const cssBundleName = "style.bundle.css";

// this dir should contain the entry point HTML and other static files
const contentBaseDir = path.resolve(__dirname, "public");

// where the built files should be
const outputDirName = path.resolve(__dirname, "dist");

// file name of entry HTML file
const htmlFile = "index.html";

// `publicUrl` is just like `publicPath`, but we will provide it to our app
// as %PUBLIC_URL% in `index.html` and `process.env.PUBLIC_URL` in JavaScript.
// Omit trailing shlash as %PUBLIC_PATH%/xyz looks better than %PUBLIC_PATH%xyz.
// In production, we read the `homepage` value from the package.json file
// (ensure the homepage value does not contain a trailing slash)
// and use "" as public url in development since Webpack Dev Server will serve
// the project at localhost:3000, aka from the root
const publicUrl = production ? packagejson.homepage || "" : "";

// common config options for both dev and prod
const config = {
  entry: "./src/index.js",
  output: {
    path: outputDirName,
    filename: "[name].bundle.js",
  },
  target: "web",
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react'],
            plugins: ['@babel/plugin-proposal-class-properties', '@babel/plugin-proposal-object-rest-spread']
          }
        },
      },
    ],
  },
  plugins: [new Dotenv({ systemvars: true })],
  resolve: {
    extensions: [".js", ".jsx"]
  },
  optimization: {
    splitChunks: {
      chunks: 'all',
      maxInitialRequests: 5,
      minSize: 20000,
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all'
        }
      }
    }
  },
};

const merged = merge(config, {
  output: {
    publicPath: "/",
  },
  // sets process.env.NODE_ENV = "development" and shows module path names
  mode: "development",
  devtool: "eval-cheap-module-source-map",
  devServer: {
    hot: true,
    historyApiFallback: true,
    compress: true,
    port: 9001,
    client: {
      overlay: {
        warnings: false,
      },
    },
    static: {
      directory: path.resolve(__dirname, "public"),
      staticOptions: {},
      // Don't be confused with `devMiddleware.publicPath`, it is `publicPath` for static directory
      // Can be:
      // publicPath: ['/static-public-path-one/', '/static-public-path-two/'],
      publicPath: "/",
      // Can be:
      // serveIndex: {} (options for the `serveIndex` option you can find https://github.com/expressjs/serve-index)
      serveIndex: true,
      // Can be:
      // watch: {} (options for the `watch` option you can find https://github.com/paulmillr/chokidar)
      watch: true,
    },
  },
  module: {
    rules: [
      {
        test: /\.(scss|css)$/,
        use: [
          { loader: "style-loader" },
          { loader: "css-loader" },
          { 
            loader: "sass-loader",
            options: {
              sassOptions: {
                quietDeps: true,
                logger: {
                  warn: function(message) {
                    // Filter out deprecation warnings
                    if (message.includes('deprecat')) {
                      return;
                    }
                    console.warn(message);
                  },
                  debug: function() {}
                }
              },
              sourceMap: true,
              webpackImporter: true
            }
          },
        ],
      },
      {
        test: /\.svg$/,
        use: ["@svgr/webpack"],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: htmlFile,
      template: path.resolve(__dirname, `${contentBaseDir}/${htmlFile}`),
    }),

    // new WorkBoxPlugin.GenerateSW({
    //  clientsClaim: true,
    //  skipWaiting: true,
    // }),
      
    // Makes the public URL available as %PUBLIC_URL% in index.html, e.g.:
    // <link rel="shortcut icon" href="%PUBLIC_URL%/favicon.ico">
    // In development, this will be an empty string.
    new InterpolateHtmlPlugin({
      PUBLIC_URL: publicUrl,
    }),
  ],
});

module.exports = merged;