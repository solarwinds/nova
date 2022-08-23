import { Component } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import _find from "lodash/find";

import { SwitchState } from "../../services/notification-args";
import NotificationService from "../../services/notification-service";
import { INotificationService } from "../../services/public-api";
import { ToastDirective } from "./toast.directive";
import { ToastService } from "./toast.service";

@Component({
    template: `<div [nuiToast]="model"></div>`,
})
class ToastTestingComponent {
    public model = {
        id: "testId",
    };
}

describe("directives >", () => {
    describe("toast >", () => {
        const successStatus = "success";
        const highlightOnClass = "highlight-on";
        let fixture: ComponentFixture<ToastTestingComponent>;
        let element: HTMLElement;
        let notificationService: INotificationService;

        beforeEach(() => {
            TestBed.configureTestingModule({
                declarations: [ToastTestingComponent, ToastDirective],
                providers: [ToastService, NotificationService],
            });
            fixture = TestBed.createComponent(ToastTestingComponent);
            fixture.autoDetectChanges(true);
            notificationService = TestBed.inject(NotificationService);
            element = fixture.nativeElement.firstChild;
        });
        it("should highlight element", () => {
            const options = {
                highlightState: SwitchState.on,
                items: [{ id: "testId" }],
                itemIdentificator: "id",
                status: "success",
            };
            notificationService.post("Highlight", options);

            expect(
                _find(
                    element.classList,
                    (className: string) => className === successStatus
                )
            ).not.toBeNull();
            expect(
                _find(
                    element.classList,
                    (className: string) => className === highlightOnClass
                )
            ).not.toBeNull();
        });
    });
});
