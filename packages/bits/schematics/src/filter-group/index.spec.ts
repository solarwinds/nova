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
import * as path from "path";

const collectionPath = path.join(__dirname, "../collection.json");

xdescribe("ng-generate filtered-view", () => {
    const runner = new SchematicTestRunner("schematics", collectionPath);

    let beforeTree: UnitTestTree; // tslint:disable-line

    beforeEach(() => {
        beforeTree.create(
            "package.json",
            JSON.stringify({
                dependencies: {},
                devDependencies: {},
            })
        );
        beforeTree.create(`tsconfig.json`, "{}");
    });

    it("adds files", async () => {
        beforeTree.create(
            "angular.json",
            JSON.stringify({
                projects: {
                    lib: {
                        architect: {
                            build: {
                                options: {},
                            },
                        },
                    },
                },
                newProjectRoot: "",
                defaultProject: "lib",
            })
        );

        const afterTree = await runner
            .runSchematic(
                "filtered-view",
                { name: "foo", project: "lib" },
                beforeTree
            )

        const fileContents = afterTree
            .read("foo/foo.component.ts")
            ?.toString("utf-8");
        expect(fileContents).toContain("export class FooComponent");
        expect(afterTree.files.includes("/foo/foo.component.html")).toEqual(
            true
        );
    });
});
