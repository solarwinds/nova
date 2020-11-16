import {SchematicTestRunner, UnitTestTree} from "@angular-devkit/schematics/testing";

describe("ng-update", () => {
    const runner = new SchematicTestRunner("schematics", require.resolve("../migration.json"));

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
        const afterTree = await runner.runSchematicAsync("nova-migration-v8", {skipTsConfig: true, project: "bar", skipCss: false}, appTree).toPromise();
        const file = JSON.parse((afterTree.read("angular.json") ?? "").toString("utf-8"));
        expect(file.projects.bar.architect.build.options.styles[0]).toEqual("./node_modules/@solarwinds/nova-bits/bundles/css/styles-v7-compat.css");
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
                                        "./node_modules/@solarwinds/nova-bits/bundles/css/styles-v7-compat.css",
                                    ],
                                },
                            },
                        },
                    },
                },
            })
        );

        const afterTree = await runner.runSchematicAsync("nova-migration-v8", {skipTsConfig: true, project: "bar", skipCss: false}, appTree).toPromise();
        const file = JSON.parse((afterTree.read("angular.json") ?? "")?.toString("utf-8"));
        expect(file.projects.bar.architect.build.options.styles.length).toEqual(1);
    });

    it("updates style array in angular.json", async () => {
        const afterTree = await runner.runSchematicAsync("nova-migration-v8", {skipTsConfig: true, project: "bar"}, appTree).toPromise();
        const file = JSON.parse((afterTree.read("angular.json") ?? "").toString("utf-8"));
        expect(file.projects.bar.architect.build.options.styles[1]).toContain("@solarwinds/nova-bits");
    });
});
