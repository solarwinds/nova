export const ANGULAR_JSON =
    "{\n" +
    '    "version": 1,\n' +
    '    "newProjectRoot": "projects",\n' +
    '    "projects": {\n' +
    '        "demo": {\n' +
    '            "root": "",\n' +
    '            "sourceRoot": "src",\n' +
    '            "projectType": "application",\n' +
    '            "prefix": "app",\n' +
    '            "schematics": {},\n' +
    '            "architect": {\n' +
    '                "build": {\n' +
    '                    "builder": "@angular-devkit/build-angular:browser",\n' +
    '                    "options": {\n' +
    '                        "outputPath": "dist/demo",\n' +
    '                        "index": "src/index.html",\n' +
    '                        "main": "src/main.ts",\n' +
    '                        "polyfills": "src/polyfills.ts",\n' +
    '                        "tsConfig": "tsconfig.json",\n' +
    '                        "assets": [],\n' +
    '                        "styles": [\n' +
    '                            "src/styles.less",\n' +
    '                            "./node_modules/@nova-ui/bits/bundles/css/styles.css",\n' +
    '                            "./node_modules/@nova-ui/charts/bundles/css/styles.css"\n' +
    "                        ],\n" +
    '                        "scripts": []\n' +
    "                    },\n" +
    '                    "configurations": {\n' +
    '                        "production": {\n' +
    '                            "fileReplacements": [{}],\n' +
    '                            "optimization": true,\n' +
    '                            "outputHashing": "all",\n' +
    '                            "sourceMap": false,\n' +
    '                            "extractCss": true,\n' +
    '                            "namedChunks": false,\n' +
    '                            "aot": true,\n' +
    '                            "extractLicenses": true,\n' +
    '                            "vendorChunk": false,\n' +
    '                            "buildOptimizer": true\n' +
    "                        }\n" +
    "                    }\n" +
    "                },\n" +
    '                "serve": {\n' +
    '                    "builder": "@angular-devkit/build-angular:dev-server",\n' +
    '                    "options": {\n' +
    '                        "browserTarget": "demo:build"\n' +
    "                    },\n" +
    '                    "configurations": {\n' +
    '                        "production": {\n' +
    '                            "browserTarget": "demo:build:production"\n' +
    "                        }\n" +
    "                    }\n" +
    "                },\n" +
    '                "extract-i18n": {\n' +
    '                    "builder": "@angular-devkit/build-angular:extract-i18n",\n' +
    '                    "options": {\n' +
    '                        "browserTarget": "demo:build"\n' +
    "                    }\n" +
    "                },\n" +
    '                "test": {\n' +
    '                    "builder": "@angular-devkit/build-angular:karma",\n' +
    '                    "options": {\n' +
    '                        "polyfills": "src/polyfills.ts",\n' +
    '                        "tsConfig": "tsconfig.json",\n' +
    '                        "styles": [],\n' +
    '                        "scripts": [],\n' +
    '                        "assets": []\n' +
    "                    }\n" +
    "                },\n" +
    '                "lint": {\n' +
    '                    "builder": "@angular-devkit/build-angular:tslint",\n' +
    '                    "options": {\n' +
    '                        "tsConfig": ["tsconfig.json"],\n' +
    '                        "exclude": ["**/node_modules/**"]\n' +
    "                    }\n" +
    "                }\n" +
    "            }\n" +
    "        }\n" +
    "    },\n" +
    '    "defaultProject": "demo"\n' +
    "}\n";
