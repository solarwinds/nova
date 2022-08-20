import { NO_ERRORS_SCHEMA } from "@angular/core";
import { TestBed, waitForAsync } from "@angular/core/testing";

import { EventBusService } from "../../services/event-bus.service";

import { OverlayComponent } from "./overlay-component/overlay.component";
import { NuiOverlayModule } from "./overlay.module";
import { OverlayService } from "./overlay.service";

describe("OverlayService >", () => {
    let service: OverlayService;
    let fixture;
    let component;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            declarations: [OverlayComponent],
            imports: [NuiOverlayModule],
            providers: [EventBusService],
            schemas: [NO_ERRORS_SCHEMA],
        }).compileComponents();

        fixture = TestBed.createComponent(OverlayComponent);
        component = fixture.componentInstance;
        service = component["overlayService"];
        component.toggleReference = document.createElement("div");
        fixture.detectChanges();
    }));

    it("should create overlayRef", () => {
        expect(service.getOverlayRef()).toBeFalsy();
        service.createOverlay();
        expect(service.getOverlayRef()).toBeTruthy();
    });

    it("should show the overlay", () => {
        expect(service.showing).toBeFalsy();
        service.show();
        expect(service.getOverlayRef().hasAttached()).toBeTruthy();
        expect(service.showing).toBeTruthy();
    });

    it("should hide the overlay", () => {
        service.show();
        expect(service.getOverlayRef().hasAttached()).toBeTruthy();

        service.hide();
        expect(service.getOverlayRef().hasAttached()).toBeFalsy();
        expect(service.showing).toBeFalsy();
    });
});
