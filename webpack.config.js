const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const webpack = require("webpack");
const path = require("path");

async function getHttpsOptions() {
  if (process.env.NODE_ENV === 'production') {
    return {};
  }
  const devCerts = require("office-addin-dev-certs");
  const httpsOptions = await devCerts.getHttpsServerOptions();
  return { ca: httpsOptions.ca, key: httpsOptions.key, cert: httpsOptions.cert };
}

module.exports = async (env, options) => {
  const dev = options.mode === "development";
  const httpsOptions = dev ? await getHttpsOptions() : {};
  const outputDir = "build";
  
  const config = {
    mode: dev ? "development" : "production",
    devtool: dev ? "source-map" : false,
    entry: {
      polyfill: ["core-js/stable", "regenerator-runtime/runtime"],
      taskpane: ["./src/index.js"]  // Connects to src/index.js
    },
    output: {
      path: path.resolve(__dirname, outputDir),
      filename: "[name].[contenthash].js",
      clean: true
    },
    optimization: {
      minimize: !dev,
      splitChunks: {
        chunks: 'all',
        minSize: 20000,
        maxSize: 244000,
        cacheGroups: {
          defaultVendors: {
            test: /[\\/]node_modules[\\/]/,
            priority: -10,
            reuseExistingChunk: true,
            name: 'vendors'
          },
          default: {
            minChunks: 2,
            priority: -20,
            reuseExistingChunk: true
          }
        }
      }
    },
    resolve: {
      extensions: [".js", ".jsx", ".json", ".html"],
      modules: ['node_modules'],
      alias: {
        '@': path.resolve(__dirname, 'src'),
        'components': path.resolve(__dirname, 'src/components')
      },
      fallback: {
        "browser": false,
        "path": require.resolve("path-browserify"),
        "os": require.resolve("os-browserify/browser")
      }
    },
    module: {
      rules: [
        {
          test: /\.(js|jsx)$/,  // Removed ts and tsx
          exclude: /node_modules/,
          use: {
            loader: "babel-loader",
            options: {
              presets: [
                ["@babel/preset-env", {
                  targets: {
                    ie: "11"
                  },
                  useBuiltIns: "usage",
                  corejs: 3
                }],
                ["@babel/preset-react", { "runtime": "automatic" }]
              ],
              plugins: [
                "@babel/plugin-transform-runtime"
              ],
              cacheDirectory: true
            }
          }
        },
        {
          test: /\.html$/,
          exclude: /node_modules/,
          use: "html-loader"
        },
        {
          test: /\.css$/,
          use: ["style-loader", "css-loader"]
        },
        {
          test: /\.(png|jpg|jpeg|gif|ico)$/,
          type: 'asset/resource',
          generator: {
            filename: 'assets/[name][ext]'
          }
        }
      ]
    },
    plugins: [
      new CleanWebpackPlugin(),
      new HtmlWebpackPlugin({
        filename: "index.html",
        template: "./public/index.html",  // Connects to public/index.html
        chunks: ['polyfill', 'taskpane']
      }),
      new webpack.DefinePlugin({
        'process.env': {
          'REACT_APP_API_URL': JSON.stringify(process.env.REACT_APP_API_URL || 'https://nhs-vaccine-backend.onrender.com/api/vaccine')
        }
      }),
      new CopyWebpackPlugin({
        patterns: [
          {
            from: "public/manifest.xml",  // Connects to manifest.xml
            to: "manifest.xml"
          },
          {
            from: "public/assets",  // Connects to icons
            to: "assets"
          }
        ]
      })
    ],
    devServer: {
      static: {
        directory: path.join(__dirname, outputDir),
        publicPath: '/'
      },
      headers: {
        "Access-Control-Allow-Origin": "*"
      },
      server: dev ? {
        type: 'https',
        options: httpsOptions
      } : {},
      port: 3002,  // Changed to match your port
      hot: true
    }
  };

  return config;
};
