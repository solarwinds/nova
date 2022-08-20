import { Overlay } from "@angular/cdk/overlay";
import { SimpleChange, SimpleChanges } from "@angular/core";
import {
    ComponentFixture,
    fakeAsync,
    flush,
    TestBed,
} from "@angular/core/testing";
import noop from "lodash/noop";

import { LoggerService } from "../../services/log-service";
import { NuiTooltipModule } from "../tooltip/tooltip.module";

import { SpinnerSize } from "./public-api";
import { SpinnerComponent } from "./spinner.component";
describe("components", () => {
    describe("spinner", () => {
        let componentFixture: ComponentFixture<SpinnerComponent>;
        let subject: SpinnerComponent;
        const message = "Label Text";
        const incorrectSize = "medium";

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [NuiTooltipModule],
                declarations: [SpinnerComponent],
                providers: [LoggerService, Overlay],
            });
            spyOnProperty(
                TestBed.inject(LoggerService),
                "warn"
            ).and.returnValue(noop);

            componentFixture = TestBed.createComponent(SpinnerComponent);
            subject = componentFixture.componentInstance;
        });

        it("should set isDeterminate value to true when percentage is specified as 0", () => {
            subject.percent = 0;

            const changes: SimpleChanges = {
                show: {} as SimpleChange,
            } as SimpleChanges;
            subject.ngOnChanges(changes);

            expect(subject.isDeterminate).toBe(true);
        });

        it("should emit cancel event when cancelProgress method is invoked", () => {
            const spy = spyOn(subject.cancel, "emit");
            subject.cancelProgress();

            componentFixture.whenStable().then(() => {
                expect(spy).toHaveBeenCalled();
            });
        });

        it("should set showSpinner value to true", fakeAsync(() => {
            subject.show = true;

            const changes: SimpleChanges = {
                show: {} as SimpleChange,
            } as SimpleChanges;
            subject.ngOnChanges(changes);

            flush();
            expect(subject.showSpinner).toBe(true);
        }));

        it("should set showText value to true when size is specified as 'large'", () => {
            subject.size = SpinnerSize.Large;

            const changes: SimpleChanges = {
                show: {} as SimpleChange,
                message: {} as SimpleChange,
            } as SimpleChanges;
            subject.ngOnChanges(changes);

            expect(subject.showText).toBe(true);
        });

        it("should cancel progress when click on cancel button", fakeAsync(() => {
            const spy = spyOn(subject, "cancelProgress");
            subject.allowCancel = true;
            subject.show = true;

            const changes: SimpleChanges = {
                show: {} as SimpleChange,
            } as SimpleChanges;
            subject.ngOnChanges(changes);

            flush();
            componentFixture.detectChanges();
            componentFixture.debugElement.nativeElement
                .querySelector(".nui-spinner__cancel")
                .click();
            expect(spy).toHaveBeenCalled();
        }));

        it("should display label when 'message' input is specified", fakeAsync(() => {
            subject.message = message;
            subject.size = SpinnerSize.Large;
            subject.show = true;

            const changes: SimpleChanges = {
                show: {} as SimpleChange,
            } as SimpleChanges;
            subject.ngOnChanges(changes);

            flush();
            componentFixture.detectChanges();
            const label =
                componentFixture.debugElement.nativeElement.querySelector(
                    ".nui-spinner__label"
                );
            expect(label.innerText.trim()).toEqual(message);
        }));
        it("should set the size to 'small' if the size input is not set", () => {
            const changes: SimpleChanges = {
                show: {} as SimpleChange,
            } as SimpleChanges;
            subject.ngOnChanges(changes);

            expect(subject.size).toEqual(SpinnerSize.Small);
        });

        it("should set the size to 'small' if the value for the size input is invalid", () => {
            subject.size = <SpinnerSize>incorrectSize;

            const changes: SimpleChanges = {
                show: {} as SimpleChange,
            } as SimpleChanges;
            subject.ngOnChanges(changes);

            expect(subject.size).toEqual(SpinnerSize.Small);
        });

        it("should set showText value to false when size is specified as 'small'", () => {
            subject.size = SpinnerSize.Small;

            const changes: SimpleChanges = {
                show: {} as SimpleChange,
                message: {} as SimpleChange,
            } as SimpleChanges;
            subject.ngOnChanges(changes);

            expect(subject.showText).toBe(false);
        });
    });
});
