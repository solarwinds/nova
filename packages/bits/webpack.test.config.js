/**
 * Custom webpack configuration for karma test build.
 *
 * Angular CDK 21 ships fesm2022 bundles that consist of multiple `.mjs` chunk
 * files with re-export relationships.  When webpack 5 bundles these it can
 * encounter a circular-dependency evaluation order that results in
 * "Class extends value undefined".
 *
 * Setting `type: 'javascript/auto'` forces webpack to treat every `.mjs` file
 * inside @angular packages as a module it fully controls, which lets it
 * correctly handle live ESM bindings and resolve the circular chain.
 */
module.exports = (config) => {
    // Ensure .mjs files from @angular packages are handled as ESM modules
    config.module.rules.push({
        test: /\.mjs$/,
        include: /node_modules[\\/]@angular/,
        type: "javascript/auto",
        resolve: {
            fullySpecified: false,
        },
    });

    return config;
};

