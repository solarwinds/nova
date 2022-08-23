import { ContentComponent } from "./content.component";

describe("components >", () => {
    describe("content >", () => {
        let subject: ContentComponent;

        beforeEach(() => {
            subject = new ContentComponent();
        });

        it("returns expected class name when size is unspecified", () => {
            expect(subject.getMessageClass()).toEqual("nui-content-normal");
        });

        it("returns expected class name when size is specified as small", () => {
            subject.size = "small";
            expect(subject.getMessageClass()).toEqual("nui-content-small");
        });

        it("returns expected class name when size is specified as large", () => {
            subject.size = "large";
            expect(subject.getMessageClass()).toEqual("nui-content-large");
        });
    });
});
