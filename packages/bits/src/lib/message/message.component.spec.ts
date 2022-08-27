import { CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import {
    ComponentFixture,
    fakeAsync,
    TestBed,
    tick,
} from "@angular/core/testing";
import { Subject } from "rxjs";

import { MessageComponent } from "./message.component";

describe("components >", () => {
    describe("message >", () => {
        const messageType = "info";

        let componentFixture: ComponentFixture<MessageComponent>;
        let subject: MessageComponent;

        beforeEach(() => {
            TestBed.configureTestingModule({
                declarations: [MessageComponent],
                schemas: [CUSTOM_ELEMENTS_SCHEMA],
            });

            componentFixture = TestBed.createComponent(MessageComponent);
            subject = componentFixture.componentInstance;
        });

        it("should have expected class name and icon name when type is specified", () => {
            subject.type = messageType;

            expect(subject.messageClass).toEqual(`nui-message-${messageType}`);
            expect(subject.icon).toEqual(
                MessageComponent.ICON_MAP[messageType]
            );
        });

        it(`shouldn't have class names when type is not specified`, () => {
            expect(subject.messageClass).toEqual("");
            expect(subject.icon).toEqual(MessageComponent.UNKNOWN_ICON);
        });

        it("should emit dismiss event when emitDismiss method is invoked", async () => {
            spyOn(subject.dismiss, "emit");

            subject.dismissMessage();

            await componentFixture.whenStable();
            expect(subject.dismissState).toEqual("dismissed");
            expect(subject.dismiss.emit).toHaveBeenCalled();
        });

        it("should change dismissState to 'dismissed' when emitDismiss method is invoked", async () => {
            componentFixture.detectChanges();

            subject.dismissMessage();

            await componentFixture.whenStable();
            expect(subject.dismissState).toEqual("dismissed");
        });

        describe("manual control >", () => {
            it("should correctly handle animation change when manualDestroyControl is triggered", fakeAsync(() => {
                const manualDestroyControl = new Subject<boolean>();

                subject.manualControl = manualDestroyControl;
                subject.ngOnInit();

                manualDestroyControl.next(false);
                tick();
                expect(subject.dismissState).toEqual("dismissed");

                manualDestroyControl.next(true);
                tick();
                expect(subject.dismissState).toEqual("initial");
            }));
        });

        it("should invoke dismiss.complete on ngOnDestroy", async () => {
            spyOn(subject.dismiss, "complete");

            subject.ngOnDestroy();

            await componentFixture.whenStable();
            expect(subject.dismiss.complete).toHaveBeenCalled();
        });
    });
});
