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
import { parse } from "jsonc-parser";

import { omitUpperPeerDependencyVersion } from "../utility/schematics-helper";

function readJsonFile(tree: UnitTestTree, path: string): any {
    return parse(tree.readContent(path).toString());
}

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

    it("adds style to angular.json without property", async () => {
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
                { skipTsConfig: true, project: "bar", skipCss: false },
                appTree
            )
        const file = readJsonFile(afterTree, "angular.json");
        expect(file.projects.bar.architect.build.options.styles[0]).toEqual(
            "./node_modules/@nova-ui/bits/bundles/css/styles.css"
        );
    });
    it("adds style to angular.json without property 2", async () => {
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
                { skipTsConfig: true, project: "bar", skipCss: false },
                appTree
            )
        const file = readJsonFile(afterTree, "angular.json");
        expect(
            file.projects.bar.architect.build.options.stylePreprocessorOptions
                .includePaths[0]
        ).toEqual("node_modules");
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
                { skipTsConfig: true, project: "bar", skipCss: false },
                appTree
            )
        const file = readJsonFile(afterTree, "angular.json");
        expect(file.projects.bar.architect.build.options.styles).toEqual([
            "./node_modules/@nova-ui/bits/bundles/css/styles.css",
        ]);
    });

    it("updates style array in angular.json", async () => {
        const afterTree = await runner
            .runSchematic(
                "ng-add",
                { skipTsConfig: true, project: "bar" },
                appTree
            )
        const file = readJsonFile(afterTree, "angular.json");
        expect(file.projects.bar.architect.build.options.styles[1]).toContain(
            "@nova-ui/bits"
        );
    });

    it("add class to html", async () => {
        const afterTree = await runner
            .runSchematic(
                "ng-add",
                { skipTsConfig: true, project: "bar", skipCss: false },
                appTree
            )
        expect(
            (afterTree.read(`/projects/bar/src/index.html`) ?? "").toString(
                "utf-8"
            )
        ).toContain("nui");
    });

    it("add property to tsConfig", async () => {
        const afterTree = await runner
            .runSchematic(
                "ng-add",
                {
                    skipCss: true,
                    skipProviders: true,
                    skipPackageJson: true,
                    project: "bar",
                },
                appTree
            )
        const afterFile = readJsonFile(
            afterTree,
            `projects/bar/tsconfig.app.json`
        );
        expect(afterFile.compilerOptions.allowSyntheticDefaultImports).toEqual(
            true
        );
    });

    it("won't re-add property to tsConfig", async () => {
        appTree.overwrite(
            `projects/bar/tsconfig.app.json`,
            JSON.stringify({
                compilerOptions: {
                    allowSyntheticDefaultImports: false,
                    module: "commonjs",
                },
                exclude: ["node_modules", "atoms.d.ts"],
                lib: ["es2017", "dom"],
            })
        );

        const afterTree = await runner
            .runSchematic(
                "ng-add",
                {
                    skipCss: true,
                    skipProviders: true,
                    skipPackageJson: true,
                    project: "bar",
                },
                appTree
            )
        const afterFile = readJsonFile(
            afterTree,
            `projects/bar/tsconfig.app.json`
        );
        expect(afterFile.compilerOptions.allowSyntheticDefaultImports).toEqual(
            false
        );
    });

    it("updates the dependencies in package.json with the peerDependencies from Bits and ignores upper versions of peer dependencies if provided", async () => {
        const afterTree = await runner
            .runSchematic(
                "ng-add",
                {
                    project: "bar",
                    skipCss: true,
                    skipProviders: true,
                    skipTsConfig: true,
                },
                appTree
            )
        const file = readJsonFile(afterTree, "package.json");
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
