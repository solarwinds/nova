import {SchematicTestRunner, UnitTestTree} from "@angular-devkit/schematics/testing";

describe("layout", () => {
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
            style: "less",
            skipTests: false,
            skipPackageJson: false,
        };
        appTree = await runner.runExternalSchematicAsync("@schematics/angular", "workspace", workspaceOptions).toPromise();
        appTree = await runner.runExternalSchematicAsync("@schematics/angular", "application", appOptions, appTree).toPromise();
    });

    it("adds basic component", async () => {
        const afterTree = await runner.runSchematicAsync("layout", {project: "bar", name: "comp"}, appTree).toPromise();
        const htmlFile = afterTree.readContent("/projects/bar/src/app/comp/comp.component.html");
        const specFile = afterTree.readContent("/projects/bar/src/app/comp/comp.component.spec.ts");
        const tsFile = afterTree.readContent("/projects/bar/src/app/comp/comp.component.ts");
        const lessFile = afterTree.readContent("/projects/bar/src/app/comp/comp.component.less");

        expect(htmlFile).toContain("<nui-sheet direction=\"column\">");
        expect(specFile).toContain("fixture = TestBed.createComponent(CompComponent)");
        expect(lessFile).toContain("nui-framework-variables");
        expect(tsFile).toContain("export class CompComponent");
    });

});
