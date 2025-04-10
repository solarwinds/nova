module.exports = {
    "extends": "../../.eslintrc.json",
    "ignorePatterns": ["node_modules/**/*"],
    "overrides": [
        {
            "files": ["*.ts"],
            "parserOptions": {
                "project": ["./tsconfig.lib.json"],
                "createDefaultProgram": true,
                "projectService": true,
                tsconfigRootDir: __dirname
            },
            "settings": {
                "import/parsers": {
                    "@typescript-eslint/parser": [".ts", ".html"]
                },
                "import/resolver": {
                    "typescript": {
                        "project": ["tsconfig.lib.json"]
                    }
                }
            }
        },
        {
            "files": ["*.spec.ts"],
            "parserOptions": {
                "project": ["./tsconfig.spec.json"],
                "createDefaultProgram": true,
                "projectService": true,
                tsconfigRootDir: __dirname
            }
        }
    ]
}
