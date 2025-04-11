module.exports = {
    extends: "./../../.eslintrc.js",
    overrides: [
        {
            files: ["*.ts"],
            parserOptions: {
                projectService: {
                    allowDefaultProject: ["environments/environment.e2e.ts"],
                },
                createDefaultProgram: true,
                tsconfigRootDir: ".",
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
                        project: ["./demo/src/tsconfig.json"],
                    },
                },
            },
        },
    ],
};
