// © 2022 SolarWinds Worldwide, LLC. All rights reserved.
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
//  of this software and associated documentation files (the "Software"), to
//  deal in the Software without restriction, including without limitation the
//  rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
//  sell copies of the Software, and to permit persons to whom the Software is
//  furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
//  all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
//  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
//  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
//  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
//  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
//  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
//  THE SOFTWARE.

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
