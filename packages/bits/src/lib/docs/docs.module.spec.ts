import { NuiDocsModule } from "./docs.module";

describe("DocsModule", () => {
    let docsModule: NuiDocsModule;

    beforeEach(() => {
        docsModule = new NuiDocsModule();
    });

    it("should create an instance", () => {
        expect(docsModule).toBeTruthy();
    });
});
