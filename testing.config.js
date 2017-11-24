module.exports = {
    entry: "./test/scenarios.ts",
    output: {
        filename: "testbundle.js",
        path: __dirname + "/bundles"
    },


    resolve: {
        // Add '.ts' and '.tsx' as resolvable extensions.
        extensions: [".ts", ".tsx", ".js" ]
    },

    module: {
        rules: [
            // All files with a '.ts' or '.tsx' extension will be handled by 'awesome-typescript-loader'.
            { test: /\.tsx?$/, loader: "ts-loader" },
        ]
    }
};