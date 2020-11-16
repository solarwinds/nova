import { SchematicTestRunner, UnitTestTree } from "@angular-devkit/schematics/testing";
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
                                options: {

                                },
                            },
                        },
                    },
                },
                newProjectRoot: "",
                defaultProject: "lib",
            })
        );

        const afterTree = await runner.runSchematicAsync("filtered-view", {name: "foo", project: "lib"}, beforeTree).toPromise();

        const fileContents = afterTree.read("foo/foo.component.ts")?.toString("utf-8");
        expect(fileContents).toContain("export class FooComponent");
        expect(afterTree.files.includes("/foo/foo.component.html")).toEqual(true);
    });
});
