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

import { Component } from "@angular/core";
import { NuiMessageModule } from "../../../../../../src/lib/message/message.module";
import { NuiDocsModule } from "../../../../../../src/lib/docs/docs.module";
import { PopupSimpleExampleComponent } from "../popup-simple-usage/popup-simple-usage.example.component";
import { PopupWithCustomWidthComponent } from "../popup-with-custom-width/popup-with-custom-width.example.component";
import { PopupAppendToBodyExampleComponent } from "../popup-append-to-body/popup-append-to-body.example.component";
import { PopupDifferentDirectionsExampleComponent } from "../popup-different-directions/popup-different-directions.example.component";
import { PopupWithCustomStylingComponent } from "../popup-with-custom-styling/popup-with-custom-styling.example.component";
import { PopupWithCustomContentComponent } from "../popup-with-custom-content/popup-with-custom-content.example.component";

@Component({
    selector: "nui-popup-docs-example",
    templateUrl: "./popup-docs.example.component.html",
    imports: [NuiMessageModule, NuiDocsModule, PopupSimpleExampleComponent, PopupWithCustomWidthComponent, PopupAppendToBodyExampleComponent, PopupDifferentDirectionsExampleComponent, PopupWithCustomStylingComponent, PopupWithCustomContentComponent]
})
export class PopupExampleComponent {}
