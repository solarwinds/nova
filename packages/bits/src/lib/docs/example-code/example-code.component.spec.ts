import { ElementRef } from "@angular/core";

import { ExampleCodeComponent } from "./example-code.component";

const hljs = require("highlight.js/lib/core");


describe("components >", () => {
    describe("code >", () => {
        let subject: ExampleCodeComponent;
        beforeEach(() => {
            subject = new ExampleCodeComponent;
            subject.codeElement =  {nativeElement: document.createElement("div")} as ElementRef;
        });

        describe("ngAfterViewInit", () => {
            it("should call hljs highlightBlock method", () => {
                spyOn(hljs, "highlightBlock");
                subject.ngAfterViewInit();
                expect(hljs.highlightBlock).toHaveBeenCalled();
            });
        });
    });
});
