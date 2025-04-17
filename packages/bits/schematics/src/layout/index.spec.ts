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
import {
    AngularApplicationOptionsSchema,
    SchematicsAngularApplicationStyle
} from "@angular/cli/lib/config/workspace-schema";

describe("layout", () => {
    const runner = new SchematicTestRunner(
        "schematics",
        require.resolve("../collection.json")
    );

    let appTree: UnitTestTree;

    beforeEach(async () => {
        const workspaceOptions = {
            name: "workspace",
            newProjectRoot: "projects",
            version: "17.0.0",
        };

        const appOptions: AngularApplicationOptionsSchema = {
            name: "bar",
            inlineStyle: false,
            inlineTemplate: false,
            routing: false,
            prefix: "test",
            style: SchematicsAngularApplicationStyle.Less,
            skipTests: false,
            standalone: false,
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

    it("adds basic component", async () => {
        const afterTree = await runner
            .runSchematic(
                "layout",
                { project: "bar", name: "comp" },
                appTree
            )
        const htmlFile = afterTree.readContent(
            "/projects/bar/src/app/comp/comp.component.html"
        );
        const specFile = afterTree.readContent(
            "/projects/bar/src/app/comp/comp.component.spec.ts"
        );
        const tsFile = afterTree.readContent(
            "/projects/bar/src/app/comp/comp.component.ts"
        );
        const lessFile = afterTree.readContent(
            "/projects/bar/src/app/comp/comp.component.less"
        );

        expect(htmlFile).toContain('<nui-sheet direction="column">');
        expect(specFile).toContain(
            "fixture = TestBed.createComponent(CompComponent)"
        );
        expect(lessFile).toContain("nui-framework-variables");
        expect(tsFile).toContain("export class CompComponent");
    });
});
