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

import {
    SchematicTestRunner,
    UnitTestTree,
} from "@angular-devkit/schematics/testing";

import { omitUpperPeerDependencyVersion } from "@nova-ui/bits/sdk/schematics";

describe("ng-add", () => {
    const runner = new SchematicTestRunner(
        "schematics",
        require.resolve("../collection.json")
    );

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
        appTree = await runner
            .runExternalSchematic(
                "@schematics/angular",
                "workspace",
                workspaceOptions
            )
        appTree = await runner
            .runExternalSchematic(
                "@schematics/angular",
                "application",
                appOptions,
                appTree
            )
    });

    it("adds styles to angular.json without property", async () => {
        appTree.overwrite(
            "angular.json",
            JSON.stringify({
                projects: {
                    bar: {
                        architect: {
                            build: {
                                options: {},
                            },
                        },
                    },
                },
            })
        );
        const afterTree = await runner
            .runSchematic(
                "ng-add",
                { project: "bar", skipModuleUpdate: true },
                appTree
            );
        const file = JSON.parse(
            (afterTree.read("angular.json") ?? "").toString("utf-8")
        );
        expect(file.projects.bar.architect.build.options.styles[0]).toEqual(
            "./node_modules/@nova-ui/charts/bundles/css/styles.css"
        );
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

        const afterTree = await runner
            .runSchematic(
                "ng-add",
                { project: "bar", skipModuleUpdate: true },
                appTree
            )
        const file = JSON.parse(
            (afterTree.read("angular.json") ?? "").toString("utf-8")
        );
        expect(file.projects.bar.architect.build.options.styles.length).toEqual(
            2
        );
    });

    it("updates style array in angular.json", async () => {
        const afterTree = await runner
            .runSchematic(
                "ng-add",
                { project: "bar", skipModuleUpdate: true },
                appTree
            );
        const file = JSON.parse(
            (afterTree.read("angular.json") ?? "").toString("utf-8")
        );
        expect(file.projects.bar.architect.build.options.styles[1]).toContain(
            "@nova-ui/charts"
        );
    });

    it("adds imports to module", async () => {
        const afterTree = await runner
            .runSchematic(
                "ng-add",
                { project: "bar", skipCss: true },
                appTree
            );
        const moduleFile = (
            afterTree.read(`/projects/bar/src/app/app.module.ts`) ?? ""
        ).toString("utf-8");
        expect(moduleFile).toContain("BrowserAnimationsModule");
        expect(moduleFile).toContain("NuiDashboardsModule");
    });

    it("updates the dependencies in package.json with the dashboards peerDependencies", async () => {
        const afterTree = await runner
            .runSchematic(
                "ng-add",
                {
                    project: "bar",
                    skipCss: true,
                    skipModuleUpdate: true,
                },
                appTree
            );
        const file = JSON.parse(
            (afterTree.read("package.json") ?? "").toString("utf-8")
        );
        const { peerDependencies } = require("../../../package.json");
        Object.keys(peerDependencies).forEach((key) => {
            expect(
                omitUpperPeerDependencyVersion(peerDependencies[key])
            ).toEqual(
                file.dependencies[key],
                `Dependency ${key} wasn't updated`
            );
        });
    });
});
