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

import { Component, ViewChild } from "@angular/core";

import {
    OVERLAY_WITH_POPUP_STYLES_CLASS,
    OverlayComponent,
} from "@nova-ui/bits";

@Component({
    selector: "nui-overlay-focus-trap-example",
    templateUrl: "./overlay-focus-trap.example.component.html",
    standalone: false,
})
export class OverlayFocusTrapExampleComponent {
    public readonly OVERLAY_WITH_POPUP_STYLES_CLASS =
        OVERLAY_WITH_POPUP_STYLES_CLASS;
    public name = "Ada Lovelace";
    public savedName = "";

    @ViewChild("overlay") public overlay: OverlayComponent;

    public saveName(): void {
        this.savedName = this.name;
        this.overlay.hide();
    }
}
