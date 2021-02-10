import { ElementRef } from "@angular/core";
import hljs from "highlight.js/lib/core";

import { ExampleCodeComponent } from "./example-code.component";

describe("components >", () => {
    describe("code >", () => {
        let subject: ExampleCodeComponent;
        beforeEach(() => {
            subject = new ExampleCodeComponent;
            subject.codeElement =  {nativeElement: document.createElement("div")} as ElementRef;
        });

        fdescribe("ngAfterViewInit", () => {
            it("should call hljs highlightBlock method", () => {
                spyOn(hljs, "highlightBlock");
                subject.ngAfterViewInit();
                expect(hljs.highlightBlock).toHaveBeenCalled();
            });
        });
    });
});
