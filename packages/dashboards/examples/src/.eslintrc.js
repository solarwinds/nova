module.exports = {
    extends: "../../.eslintrc.js",
    overrides: [
        {
            files: ["*.ts"],
            parserOptions: {
                projectService: true,
                createDefaultProgram: true,
                tsconfigRootDir: __dirname,
            },
            rules: {
                "max-len": "off",
            },
            settings: {
                "import/parsers": {
                    "@typescript-eslint/parser": [".ts", ".html"],
                },
                "import/resolver": {
                    typescript: {
                        project: ["./examples/src/tsconfig.json"],
                    },
                },
            },
        },
    ],
};
