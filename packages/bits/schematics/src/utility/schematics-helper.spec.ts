import { Tree, UpdateRecorder } from "@angular-devkit/schematics/src/tree/interface";
import * as vendoredAstUtils from "@angular/cdk/schematics/utils/vendored-ast-utils";
import * as astUtils from "@schematics/angular/utility/ast-utils";
import ts from "typescript";

import { updateModuleChanges } from "./schematics-helper";

describe("Schematics Helper >", () => {
    describe("updateModuleChanges", () => {
        const mockHost = { beginUpdate: () => ({} as UpdateRecorder), commitUpdate: () => {} } as unknown as Tree;
        const mockOptions = { module: "test/path" };
        const mockSourceFile = {} as ts.SourceFile;

        it("should specify the correct path for a module import", async () => {
            const mockModules = [
                {item: "TestModule", path: "@nova-ui/bits"},
            ];

            spyOn(astUtils, "isImported").and.returnValue(false);
            const spy = spyOn(vendoredAstUtils, "addImportToModule").and.returnValue([]);
            updateModuleChanges(mockHost, mockOptions, mockSourceFile, mockModules, [], []);
            expect(spy).toHaveBeenCalledWith(mockSourceFile, mockOptions.module, mockModules[0].item, mockModules[0].path);
        });
    });

});
