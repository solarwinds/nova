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
    Tree,
    UpdateRecorder,
} from "@angular-devkit/schematics/src/tree/interface";
// import mock from "mock-require";
import pq from "proxyquire";
import ts from "typescript";

describe("Schematics Helper >", () => {
    describe("updateModuleChanges", () => {
        const mockHost: Tree = {
            beginUpdate: () => ({} as UpdateRecorder),
            commitUpdate: () => {},
        } as Partial<Tree> as Tree;
        const mockOptions = { module: "test/path" };
        const mockSourceFile = {} as ts.SourceFile;

        it("should specify the correct path for a module import", async () => {
            const mockModules = [{ item: "TestModule", path: "@nova-ui/bits" }];

            const mockCdkSchematics = {
                addImportToModule: jasmine
                    .createSpy(
                        "addImportToModule",
                        (
                            _source: ts.SourceFile,
                            _modulePath: string,
                            _classifiedName: string,
                            _importPath: string
                        ) => []
                    )
                    .and.callThrough(),
            };

            const mockAstUtils = {
                isImported: () => false,
            };

            const helper = pq("./schematics-helper", {
                "@schematics/angular/utility/ast-utils": mockAstUtils,
                "@angular/cdk/schematics": mockCdkSchematics,
            });

            helper.updateModuleChanges(
                mockHost,
                mockOptions,
                mockSourceFile,
                mockModules,
                [],
                []
            );

            expect(mockCdkSchematics.addImportToModule).toHaveBeenCalledWith(
                mockSourceFile,
                mockOptions.module,
                mockModules[0].item,
                mockModules[0].path
            );
        });
    });
});
