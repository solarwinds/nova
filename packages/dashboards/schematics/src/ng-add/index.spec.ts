import { SchematicTestRunner, UnitTestTree } from "@angular-devkit/schematics/testing";

describe("ng-add", () => {
    const runner = new SchematicTestRunner("schematics", require.resolve("../collection.json"));

    let appTree: UnitTestTree;

    beforeEach(async () => {
        const workspaceOptions = {
            name: "workspace",
            newProjectRoot: "projects",
            version: "1.0.0",
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

    it("adds styles to angular.json without property", async () => {
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
        const afterTree = await runner.runSchematicAsync("ng-add", { project: "bar", skipModuleUpdate: true }, appTree).toPromise();
        const file = JSON.parse((afterTree.read("angular.json") ?? "").toString("utf-8"));
        expect(file.projects.bar.architect.build.options.styles[0]).toEqual("./node_modules/@nova-ui/charts/bundles/css/styles.css");
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
                                        "./node_modules/@nova-ui/bits/bundles/css/styles.css",
                                        "./node_modules/@nova-ui/charts/bundles/css/styles.css",
                                    ],
                                },
                            },
                        },
                    },
                },
            })
        );

        const afterTree = await runner.runSchematicAsync("ng-add", { project: "bar", skipModuleUpdate: true }, appTree).toPromise();
        const file = JSON.parse((afterTree.read("angular.json") ?? "").toString("utf-8"));
        expect(file.projects.bar.architect.build.options.styles.length).toEqual(2);
    });

    it("updates style array in angular.json", async () => {
        const afterTree = await runner.runSchematicAsync("ng-add", { project: "bar", skipModuleUpdate: true }, appTree).toPromise();
        const file = JSON.parse((afterTree.read("angular.json") ?? "").toString("utf-8"));
        expect(file.projects.bar.architect.build.options.styles[1]).toContain("@nova-ui/charts");
    });

    it("adds imports to module", async () => {
        const afterTree = await runner.runSchematicAsync("ng-add", { project: "bar", skipCss: true }, appTree).toPromise();
        const moduleFile = (afterTree.read(`/projects/bar/src/app/app.module.ts`) ?? "").toString("utf-8");
        expect(moduleFile).toContain("BrowserAnimationsModule");
        expect(moduleFile).toContain("NuiDashboardsModule");
    });

    it("updates the dependencies in package.json with the dashboards peerDependencies", async () => {
        const afterTree = await runner.runSchematicAsync("ng-add",
            {
                project: "bar",
                skipCss: true,
                skipModuleUpdate: true,
            }, appTree).toPromise();
        const file = JSON.parse((afterTree.read("package.json") ?? "").toString("utf-8"));
        const { peerDependencies } = require("../../../package.json");
        Object.keys(peerDependencies).forEach((key) => {
            expect(peerDependencies[key]).toEqual(file.dependencies[key], `Dependency ${key} wasn't updated`);
        });
    });

});
