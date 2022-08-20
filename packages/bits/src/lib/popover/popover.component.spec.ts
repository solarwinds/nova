import { OverlayModule } from "@angular/cdk/overlay";
import { Component, CUSTOM_ELEMENTS_SCHEMA, DebugElement } from "@angular/core";
import {
    ComponentFixture,
    fakeAsync,
    flush,
    TestBed,
    tick,
} from "@angular/core/testing";
import { By } from "@angular/platform-browser";
import _noop from "lodash/noop";
import { Subject } from "rxjs";

import { PositionService } from "../../services/position.service";
import { UtilService } from "../../services/util.service";
import { NuiOverlayModule } from "../overlay/overlay.module";

import { PopoverModalComponent } from "./popover-modal.component";
import { PopoverComponent } from "./popover.component";

@Component({
    template: ` <nui-popover
        trigger="click mouseenter focus"
        (shown)="handleShowPopover()"
        (hidden)="handleHidePopover()"
    ></nui-popover>`,
    entryComponents: [PopoverModalComponent],
})
class PopoverComponentTestingComponent {
    public handleShowPopover() {
        _noop();
    }

    public handleHidePopover() {
        _noop();
    }
}

describe("components >", () => {
    describe("popover >", () => {
        let fixture: ComponentFixture<PopoverComponentTestingComponent>;
        let component: PopoverComponentTestingComponent;
        let popoverDebugElement: DebugElement;

        let subject: PopoverComponent;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [OverlayModule, NuiOverlayModule],
                declarations: [
                    PopoverComponent,
                    PopoverComponentTestingComponent,
                    PopoverModalComponent,
                ],
                providers: [UtilService, PositionService],
                schemas: [CUSTOM_ELEMENTS_SCHEMA],
            });
            fixture = TestBed.createComponent(PopoverComponentTestingComponent);
            fixture.autoDetectChanges(true);
            component = fixture.componentInstance;
            popoverDebugElement = fixture.debugElement.query(
                By.directive(PopoverComponent)
            );
            subject = popoverDebugElement.injector.get(
                PopoverComponent
            ) as PopoverComponent;
        });

        describe("showPopover >", () => {
            let resizeObserverSpy: jasmine.Spy;

            beforeEach(() => {
                spyOn(subject.overlayComponent, "show");
                spyOn(component, "handleShowPopover");
                resizeObserverSpy = spyOn<any>(
                    subject,
                    "initializeResizeObserver"
                );

                subject.showPopover();
            });

            it("should display popover", () => {
                expect(subject.overlayComponent.show).toHaveBeenCalled();
            });

            it("should notify popover is displayed", () => {
                expect(component.handleShowPopover).toHaveBeenCalled();
            });

            it("should init ResizeObserver", () => {
                expect(resizeObserverSpy).toHaveBeenCalled();
            });
        });

        describe("when popover disabled", () => {
            beforeEach(() => {
                spyOn(subject.shown, "emit").and.callThrough();
            });

            it("should not show popover", () => {
                subject.disabled = true;
                subject.showPopover();
                expect(subject.shown.emit).not.toHaveBeenCalled();
            });

            it("should show popover when enabled", () => {
                subject.disabled = false;
                subject.showPopover();
                expect(subject.shown.emit).toHaveBeenCalled();
            });
        });

        describe("actions >", () => {
            beforeEach(() => {
                spyOn(subject, "showPopover").and.callThrough();
                spyOn(subject as any, "hidePopover").and.callThrough();
            });

            describe("onClick >", () => {
                beforeEach(() => {
                    subject.onClick(new MouseEvent("click"));
                });

                it("should show popover on click (click is one of its triggers here)", () => {
                    expect(subject.showPopover).toHaveBeenCalled();
                });
            });

            describe("onMouseEnter >", () => {
                beforeEach(() => {
                    subject.onMouseEnter();
                });

                it("should show popover on hover (mouse enter is one of its triggers here)", () => {
                    expect(subject.showPopover).toHaveBeenCalled();
                });
            });

            describe("onMouseEnter with delay >", () => {
                beforeEach(() => {
                    subject.delay = 1000;
                });

                it("should NOT show popover on hover before the delay", fakeAsync(() => {
                    subject.onMouseEnter();
                    tick(subject.delay - 500);

                    expect(subject.showPopover).not.toHaveBeenCalled();
                    flush();
                }));

                it("should NOT show popover on hover before the delay and clear previous interval", fakeAsync(() => {
                    // this 1st call prepares an interval
                    subject.onMouseEnter();

                    // calling 2nd time will clear the previous interval
                    subject.onMouseEnter();
                    tick(subject.delay - 500);
                    expect(subject.showPopover).not.toHaveBeenCalled();
                    flush();
                }));

                it("should show popover on hover after the delay elapsed", fakeAsync(() => {
                    subject.onMouseEnter();
                    tick(subject.delay + 500);
                    expect(subject.showPopover).toHaveBeenCalled();
                    flush();
                }));
            });

            describe("onMouseLeave >", () => {
                beforeEach(() => {
                    subject.onMouseLeave();
                });

                it("should NOT show popover on unhover (mouse leave is NOT a trigger here)", () => {
                    expect(subject.showPopover).not.toHaveBeenCalled();
                });
            });

            describe("onBackdropClick >", () => {
                it("should call popoverHoverSubject.next with backdrop-click param", () => {
                    const eventSubject = (subject["popoverModalEventSubject"] =
                        new Subject());
                    subject.modal = true;
                    spyOn(eventSubject, "next");
                    subject.onBackdropClick();
                    expect(eventSubject.next).toHaveBeenCalledWith(
                        "backdrop-click"
                    );
                });
            });
        });

        describe("popover resize >", () => {
            it("when overlay changes in size and resetSize gets called the height and width of the popover is undefined", () => {
                subject.showPopover();
                subject.overlayComponent.getOverlayRef().updateSize({
                    height: 100,
                    width: 100,
                });
                expect(
                    subject.overlayComponent.getOverlayRef().getConfig().height
                ).toEqual(100);
                expect(
                    subject.overlayComponent.getOverlayRef().getConfig().width
                ).toEqual(100);
                subject.resetSize();
                expect(
                    subject.overlayComponent.getOverlayRef().getConfig().height
                ).toBeUndefined();
                expect(
                    subject.overlayComponent.getOverlayRef().getConfig().width
                ).toBeUndefined();
            });
        });

        describe("popover options >", () => {
            it("should set the withGrowAfterOpen to true if the input is true", () => {
                subject.withGrowAfterOpen = true;
                subject.showPopover();
                // @ts-ignore
                expect(
                    subject.overlayConfig.positionStrategy._growAfterOpen
                ).toBeTrue();
            });
        });
    });
});
