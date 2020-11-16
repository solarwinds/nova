import { SchematicTestRunner, UnitTestTree } from "@angular-devkit/schematics/testing";

describe("ng-add", () => {
    const runner = new SchematicTestRunner("schematics", require.resolve("../collection.json"));

    let appTree: UnitTestTree;

    beforeEach(async () => {
        const workspaceOptions = {
            name: "workspace",
            newProjectRoot: "projects",
            version: "6.0.0",
        };

        const appOptions = {
            name: "bar",
            inlineStyle: false,
            inlineTemplate: false,
            routing: false,
            style: "css",
            skipTests: false,
            skipPackageJson: false,
        };
        appTree = await runner.runExternalSchematicAsync("@schematics/angular", "workspace", workspaceOptions).toPromise();
        appTree = await runner.runExternalSchematicAsync("@schematics/angular", "application", appOptions, appTree).toPromise();
    });

    it("adds style to angular.json without property", async () => {
        appTree.overwrite(
            "angular.json",
            JSON.stringify({
                projects: {
                    bar: {
                        architect: {
                            build: {
                                options: {
                                },
                            },
                        },
                    },
                },
            })
        );
        const afterTree = await runner.runSchematicAsync("ng-add", { skipTsConfig: true, project: "bar", skipCss: false }, appTree).toPromise();
        const file = JSON.parse((afterTree.read("angular.json") ?? "").toString("utf-8"));
        expect(file.projects.bar.architect.build.options.styles[0]).toEqual("./node_modules/@solarwinds/nova-bits/bundles/css/styles.css");
    });
    it("adds style to angular.json without property", async () => {
        appTree.overwrite(
            "angular.json",
            JSON.stringify({
                projects: {
                    bar: {
                        architect: {
                            build: {
                                options: {
                                },
                            },
                        },
                    },
                },
            })
        );
        const afterTree = await runner.runSchematicAsync("ng-add", { skipTsConfig: true, project: "bar", skipCss: false }, appTree).toPromise();
        const file = JSON.parse((afterTree.read("angular.json") ?? "").toString("utf-8"));
        expect(file.projects.bar.architect.build.options.stylePreprocessorOptions.includePaths[0]).toEqual("node_modules");
    });

    it("does not re-add style to angular.json", async () => {
        appTree.overwrite(
            "angular.json",
            JSON.stringify({
                projects: {
                    bar: {
                        architect: {
                            build: {
                                options: {
                                    styles: [
                                        "./node_modules/@solarwinds/nova-bits/bundles/css/styles.css",
                                    ],
                                },
                            },
                        },
                    },
                },
            })
        );

        const afterTree = await runner.runSchematicAsync("ng-add", { skipTsConfig: true, project: "bar", skipCss: false }, appTree).toPromise();
        const file = JSON.parse((afterTree.read("angular.json") ?? "").toString("utf-8"));
        expect(file.projects.bar.architect.build.options.styles.length).toEqual(1);
    });

    it("updates style array in angular.json", async () => {
        const afterTree = await runner.runSchematicAsync("ng-add", { skipTsConfig: true, project: "bar" }, appTree).toPromise();
        const file = JSON.parse((afterTree.read("angular.json") ?? "").toString("utf-8"));
        expect(file.projects.bar.architect.build.options.styles[1]).toContain("@solarwinds/nova-bits");
    });

    it("add class to html", async () => {
        const afterTree = await runner.runSchematicAsync("ng-add", { skipTsConfig: true, project: "bar", skipCss: false }, appTree).toPromise();
        expect((afterTree.read(`/projects/bar/src/index.html`) ?? "").toString("utf-8")).toContain("nui");
    });

    it("add property to tsConfig", async () => {
        const afterTree = await runner.runSchematicAsync("ng-add", { skipCss: true, skipProviders: true, skipPackageJson: true, project: "bar" }, appTree)
            .toPromise();
        const afterFile = JSON.parse((afterTree.read(`projects/bar/tsconfig.app.json`) ?? "").toString("utf-8"));
        expect(afterFile.compilerOptions.allowSyntheticDefaultImports).toEqual(true);
    });

    it("won't re-add property to tsConfig", async () => {
        appTree.overwrite(`projects/bar/tsconfig.app.json`, JSON.stringify(
            {
                "compilerOptions": {
                    "allowSyntheticDefaultImports": false,
                    "module": "commonjs",
                },
                "exclude": [
                    "node_modules",
                    "atoms.d.ts",
                ],
                "lib": [
                    "es2017",
                    "dom",
                ],
            }));

        const afterTree = await runner.runSchematicAsync("ng-add", { skipCss: true, skipProviders: true, skipPackageJson: true, project: "bar" }, appTree)
            .toPromise();
        const afterFile = JSON.parse((afterTree.read(`projects/bar/tsconfig.app.json`) ?? "").toString("utf-8"));
        expect(afterFile.compilerOptions.allowSyntheticDefaultImports).toEqual(false);
    });

    it("updates the dependencies in package.json with the peerDependencies from Bits", async () => {
        const afterTree = await runner.runSchematicAsync("ng-add",
            {
                project: "bar",
                skipCss: true,
                skipProviders: true,
                skipTsConfig: true,
            }, appTree).toPromise();
        const file = JSON.parse((afterTree.read("package.json") ?? "").toString("utf-8"));
        const { peerDependencies } = require("../../../package.json");
        Object.keys(peerDependencies).forEach((key) => {
            expect(peerDependencies[key]).toEqual(file.dependencies[key], `Dependency ${key} wasn't updated`);
        });
    });
});
