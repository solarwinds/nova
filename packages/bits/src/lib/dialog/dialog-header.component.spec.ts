import { ComponentFixture, TestBed } from "@angular/core/testing";

import { ButtonComponent, IconComponent } from "../../public_api";
import { LoggerService } from "../../services/log-service";
import { DialogHeaderComponent } from "./dialog-header.component";

describe("components >", () => {
    describe("Dialog header >", () => {
        let fixture: ComponentFixture<DialogHeaderComponent>;
        let subject: DialogHeaderComponent;

        beforeEach(() => {
            TestBed.configureTestingModule({
                declarations: [
                    DialogHeaderComponent,
                    ButtonComponent,
                    IconComponent,
                ],
                providers: [LoggerService],
            });

            fixture = TestBed.createComponent(DialogHeaderComponent);
            subject = fixture.componentInstance;
        });

        it("should set severityClass and severityIcon", () => {
            subject.severity = "critical";
            subject.ngOnInit();

            expect(subject.severityClass).toBe(
                `dialog-header-${subject.severity}`
            );
            expect(subject.severityIcon).toBe(`severity_${subject.severity}`);
        });

        it("should emit event outside from dialog header", () => {
            spyOn(subject.closed, "emit");
            const event = { event: {} as MouseEvent };
            subject.innerClose(event);

            expect(subject.closed.emit).toHaveBeenCalledWith(event);
        });
    });
});
