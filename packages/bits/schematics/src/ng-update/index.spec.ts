// © 2022 SolarWinds Worldwide, LLC. All rights reserved.
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
//  of this software and associated documentation files (the "Software"), to
//  deal in the Software without restriction, including without limitation the
//  rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
//  sell copies of the Software, and to permit persons to whom the Software is
//  furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
//  all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
//  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
//  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
//  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
//  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
//  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
//  THE SOFTWARE.

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
        expect(file.projects.bar.architect.build.options.styles[0]).toEqual("./node_modules/@nova-ui/bits/bundles/css/styles-v7-compat.css");
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
                                        "./node_modules/@nova-ui/bits/bundles/css/styles-v7-compat.css",
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
        expect(file.projects.bar.architect.build.options.styles[1]).toContain("@nova-ui/bits");
    });
});
