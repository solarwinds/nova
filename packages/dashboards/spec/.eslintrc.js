module.exports = {
    "extends": "../.eslintrc.js",
    "overrides": [
        {
            "files": ["*.ts"],
            "parserOptions": {
                "project": ["spec/tsconfig.atom.json"]
            }
        }
    ]
}
