import { WidgetConfiguratorSectionHeaderPipe } from "./widget-configurator-section-header.pipe";

describe("WidgetEditorAccordionFormStatePipe > ", () => {
    let pipe: WidgetConfiguratorSectionHeaderPipe;

    beforeEach(() => {
        pipe = new WidgetConfiguratorSectionHeaderPipe();
    });

    describe("transform > ", () => {
        it("should return the correct string when the headerText is empty", () => {
            const testHeaderText = "";
            const testPrefix = "Test Prefix";
            expect(pipe.transform(testHeaderText, 0, testPrefix)).toEqual(`${testPrefix} 1`);
        });

        it("should return the correct string when the headerText is undefined", () => {
            const testHeaderText: string | undefined = undefined;
            const testPrefix = "Test Prefix";
            expect(pipe.transform(testHeaderText, 0, testPrefix)).toEqual(`${testPrefix} 1`);
        });

        it("should return the correct string when no prefix is specified", () => {
            const testHeaderText: string | undefined = undefined;
            expect(pipe.transform(testHeaderText, 0)).toEqual(`Value 1`);
        });

        it("should return the correct string when all arguments are provided", () => {
            const testText = "Test Text";
            const testPrefix = "Test Prefix";
            expect(pipe.transform(testText, 0, testPrefix)).toEqual(`${testPrefix} 1 - ${testText}`);
        });
    });

});
