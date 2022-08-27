import { CUSTOM_ELEMENTS_SCHEMA, DebugElement } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { By } from "@angular/platform-browser";
import noop from "lodash/noop";

import { ClipboardExampleComponent } from "../../../../demo/src/components/demo/common/clipboard/clipboard.example.component";
import { LoggerService } from "../../../services/log-service";
import { ClipboardDirective } from "./clipboard.directive";

describe("directives >", () => {
    describe("clipboard >", () => {
        let fixture: ComponentFixture<ClipboardExampleComponent>;
        let subject: ClipboardExampleComponent;
        let de: DebugElement;
        let button: HTMLButtonElement;
        let event: Event;

        beforeEach(() => {
            TestBed.configureTestingModule({
                declarations: [ClipboardExampleComponent, ClipboardDirective],
                providers: [LoggerService],
                schemas: [CUSTOM_ELEMENTS_SCHEMA],
            });

            fixture = TestBed.createComponent(ClipboardExampleComponent);
            subject = fixture.componentInstance;
            const logger = TestBed.inject(LoggerService);
            spyOnProperty(logger, "error").and.returnValue(noop);
            spyOnProperty(logger, "warn").and.returnValue(noop);

            de = fixture.debugElement;
            button = de.query(By.directive(ClipboardDirective))
                .nativeElement as HTMLButtonElement;
            event = new Event("click");
        });

        it("should trigger onClipboardSuccess method on success copy", () => {
            const spy = spyOn(subject, "onClipboardSuccess");
            subject.textToCopy = "simple text";

            fixture.detectChanges();
            button.dispatchEvent(event);
            fixture.detectChanges();

            expect(spy).toHaveBeenCalled();
        });

        it("should trigger onClipboardError method on copy fail", () => {
            const spy = spyOn(subject, "onClipboardError");
            spyOn(document, "queryCommandSupported").and.returnValue(false);
            subject.textToCopy = "example test";

            fixture.detectChanges();
            button.dispatchEvent(event);
            fixture.detectChanges();

            expect(spy).toHaveBeenCalled();
        });

        it("should not copy empty string", () => {
            const spy = spyOn(subject, "onClipboardSuccess");
            subject.textToCopy = "";

            fixture.detectChanges();
            button.dispatchEvent(event);
            fixture.detectChanges();

            expect(spy).not.toHaveBeenCalled();
        });
    });
});
