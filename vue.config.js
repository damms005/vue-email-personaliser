const path = require("path");

module.exports = {
    devServer: {
        host: 'localhost'
    },
    outputDir: path.resolve(__dirname, './dist/'),
    assetsDir: 'assets/',
    filenameHashing: false
}
