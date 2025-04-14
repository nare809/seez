const WorkBoxPlugin = require('workbox-webpack-plugin');
const { InjectManifest } = require('workbox-webpack-plugin');
const path = require("path");
const url = require("url");
const { merge } = require("webpack-merge");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const InterpolateHtmlPlugin = require("interpolate-html-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const TerserJSPlugin = require("terser-webpack-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const Dotenv = require("dotenv-webpack");
const packagejson = require("./package.json");

// Try to load optional plugins
let CompressionPlugin, BundleAnalyzerPlugin;
try {
  CompressionPlugin = require("compression-webpack-plugin");
} catch (err) {
  console.log("CompressionPlugin not found, gzip compression disabled");
}

try {
  BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
} catch (err) {
  console.log("BundleAnalyzerPlugin not found, bundle analysis disabled");
}

// Set production environment
process.env.NODE_ENV = "production";
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
    rules: [{
            test: /\.(js|jsx)$/,
            exclude: /node_modules/,
            use: {
                loader: 'babel-loader',
                options: {
                  presets: ['@babel/preset-env', '@babel/preset-react'],
                  plugins: ['@babel/plugin-proposal-class-properties', '@babel/plugin-proposal-object-rest-spread']
                }
            }
        },
    ]
},
  plugins: [new Dotenv({ systemvars: true })],
  resolve: {
    extensions: ['.js', '.jsx']
  }
};

// Build the plugins array with conditional plugins
const plugins = [
  // clean up dist dir
  new CleanWebpackPlugin(),

  // for service worker
  new WorkBoxPlugin.GenerateSW({
    clientsClaim: true,
    skipWaiting: true,
    disableDevLogs: true,
    exclude: [/_redirects/]
  }),

  // output CSS bundle
  new MiniCssExtractPlugin({
    filename: "[name].bundle.css"
  }),
  // inject bundles into our HTML file and minify
  new HtmlWebpackPlugin({
    filename: htmlFile,
    template: path.resolve(contentBaseDir, htmlFile),
    minify: {
      removeComments: true,
      collapseWhitespace: true,
      removeRedundantAttributes: true,
      useShortDoctype: true,
      removeEmptyAttributes: true,
      removeStyleLinkTypeAttributes: true,
      keepClosingSlash: true,
      minifyJS: true,
      minifyCSS: true,
      minifyURLs: true
    }
  }),
  // Makes the public URL available as %PUBLIC_URL% in index.html, e.g.:
  // <link rel="shortcut icon" href="%PUBLIC_URL%/favicon.ico">
  // In development, this will be an empty string.
  new InterpolateHtmlPlugin({
    PUBLIC_URL: publicUrl
  }),
  // Copy all static files to the build folder except HTML files, which
  // should be handled by HtmlWebpackPlugin
  new CopyWebpackPlugin({
  patterns: [
    { from: contentBaseDir, to: "./",
      globOptions: {
        ignore: [
          "**/*.html"
        ]
      }
    }]
  })
];

// Add conditional plugins
if (CompressionPlugin) {
  plugins.push(
    new CompressionPlugin({
      filename: "[path][base].gz",
      algorithm: "gzip",
      test: /\.(js|css|html|svg)$/,
      threshold: 10240,
      minRatio: 0.8
    })
  );
}

if (BundleAnalyzerPlugin && process.env.ANALYZE) {
  plugins.push(
    new BundleAnalyzerPlugin({
      analyzerMode: 'static',
      reportFilename: 'bundle-report.html',
      openAnalyzer: false
    })
  );
}

const merged = merge(config, {
  output: {
    publicPath: "/",
  },
  // minify JS, set process.env.NODE_ENV = "production" and other optimizations
  mode: "production",
  optimization: {
      minimizer: [
        new TerserJSPlugin({}), 
        new CssMinimizerPlugin()
      ],
      removeEmptyChunks: true,
      mergeDuplicateChunks: true,
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
  // source map type
  devtool: "source-map",
  module: {
    rules: [
      {
        test: /\.(scss|css)$/,
        use: [
          MiniCssExtractPlugin.loader, 
          "css-loader", 
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
                },
                outputStyle: 'compressed'
              },
              sourceMap: false,
              webpackImporter: true
            }
          }
        ]
      },
      {
        test: /\.svg$/,
        use: ['@svgr/webpack']
      }
    ]
  },
  plugins: plugins
});


module.exports = merged;