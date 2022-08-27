import { DebugElement } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { BehaviorSubject, Subject } from "rxjs";

import { IconService } from "../../lib/icon/icon.service";
import { IconComponent } from "../../public_api";
import { EdgeDetectionService } from "../../services/edge-detection.service";
import { LoggerService } from "../../services/log-service";
import { PositionService } from "../../services/position.service";
import { OverlayArrowComponent } from "../overlay/arrow-component/overlay-arrow.component";
import { PopoverModalComponent } from "./popover-modal.component";

describe("components >", () => {
    describe("popover-modal >", () => {
        let fixture: ComponentFixture<PopoverModalComponent>;
        let subject: PopoverModalComponent;
        let debugElement: DebugElement;

        beforeEach(() => {
            TestBed.configureTestingModule({
                declarations: [
                    PopoverModalComponent,
                    IconComponent,
                    OverlayArrowComponent,
                ],
                providers: [
                    EdgeDetectionService,
                    LoggerService,
                    IconService,
                    PositionService,
                ],
            });
            fixture = TestBed.createComponent(PopoverModalComponent);
            subject = fixture.componentInstance;
            debugElement = fixture.debugElement;
        });

        describe("popover modal events >", () => {
            it("should call popoverHoverSubject.next with mouse-enter param", () => {
                subject.popoverModalEventSubject = new Subject();
                spyOn(subject.popoverModalEventSubject, "next");
                debugElement.triggerEventHandler("mouseenter", null);
                expect(
                    subject.popoverModalEventSubject.next
                ).toHaveBeenCalledWith("mouse-enter");
            });

            it("should call popoverHoverSubject.next with mouse-leave param", () => {
                subject.popoverModalEventSubject = new Subject();
                spyOn(subject.popoverModalEventSubject, "next");
                debugElement.triggerEventHandler("mouseleave", null);
                expect(
                    subject.popoverModalEventSubject.next
                ).toHaveBeenCalledWith("mouse-leave");
            });
        });

        describe("displayChange>", () => {
            it("should update fadeIn", () => {
                subject.fadeIn = true;
                subject.popoverBeforeHiddenSubject = new Subject();
                subject.displayChange = new BehaviorSubject<boolean>(true);
                subject.ngOnInit();
                subject.displayChange.next(false);
                expect(subject.fadeIn).toBe(false);
            });
        });

        describe("ngAfterViewInit>", () => {
            it("should update fadeIn in zoneSubscription", () => {
                subject.fadeIn = false;
                subject.context = {
                    arrowMarginTop: 0,
                    icon: "add",
                    popoverPosition: "left",
                    title: "title",
                    placement: "left",
                };
                subject.ngAfterViewInit();
                (subject as any).zone.onStable.next();
                expect(subject.fadeIn).toBe(true);
            });
        });
    });
});
