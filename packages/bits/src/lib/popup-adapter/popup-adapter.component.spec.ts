// © 2022 SolarWinds Worldwide, LLC. All rights reserved.
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to
// deal in the Software without restriction, including without limitation the
// rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
// sell copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.

import { Component } from "@angular/core";
import {
    ComponentFixture,
    fakeAsync,
    TestBed,
    tick,
} from "@angular/core/testing";
import { By } from "@angular/platform-browser";

import { PopupComponent } from "./popup-adapter.component";
import { PopupAdapterModule } from "./popup-adapter.module";

@Component({
    template: `
        <nui-popup
            [isHostToggleRef]="true"
            [isOpen]="isOpen"
            (opened)="openedStates.push($event)"
        >
            <button type="button">Info</button>
            <div popupAreaContent>Popup content</div>
        </nui-popup>
    `,
    standalone: false,
})
class PopupAdapterTestHostComponent {
    public isOpen = false;
    public openedStates: boolean[] = [];
}

describe("PopupComponent (adapter)", () => {
    let fixture: ComponentFixture<PopupAdapterTestHostComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [PopupAdapterTestHostComponent],
            imports: [PopupAdapterModule],
        });
        fixture = TestBed.createComponent(PopupAdapterTestHostComponent);
    });

    afterEach(() => {
        fixture?.destroy();
    });

    const getPopup = (): PopupComponent =>
        fixture.debugElement.query(By.directive(PopupComponent))
            .componentInstance;

    it("initializes closed on [isOpen]='false', tolerates repeated pre-open closes, and opens/closes normally", fakeAsync(() => {
        fixture.detectChanges();
        tick(0);

        const popup = getPopup();
        expect(popup.popup.getOverlayRef()).toBeUndefined();
        expect(popup.isOpen).toBe(false);
        expect(fixture.componentInstance.openedStates).toEqual([false]);

        popup.closePopup();
        tick(0);

        expect(popup.popup.getOverlayRef()).toBeUndefined();
        expect(popup.isOpen).toBe(false);
        expect(fixture.componentInstance.openedStates).toEqual([false, false]);

        fixture.componentInstance.isOpen = true;
        fixture.detectChanges();

        const overlayRef = popup.popup.getOverlayRef();
        expect(popup.isOpen).toBe(true);
        expect(overlayRef.overlayElement.classList.contains("visible")).toBe(
            true
        );
        expect(fixture.componentInstance.openedStates).toEqual([
            false,
            false,
            true,
        ]);

        fixture.componentInstance.isOpen = false;
        fixture.detectChanges();
        expect(overlayRef.overlayElement.classList.contains("visible")).toBe(
            false
        );
        tick(0);

        expect(popup.isOpen).toBe(false);
        expect(fixture.componentInstance.openedStates).toEqual([
            false,
            false,
            true,
            false,
        ]);
    }));
});
