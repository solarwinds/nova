const webpack = require('webpack');
module.exports = {
    plugins: [
        new webpack.ContextReplacementPlugin(/moment[/\\]locale$/, /en-gb|de|en-us|es|fr|it|pt-br|jp/)
    ],
};
