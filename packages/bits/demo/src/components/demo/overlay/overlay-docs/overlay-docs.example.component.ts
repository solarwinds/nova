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
import { OverlaySimpleExampleComponent } from "../overlay-simple-usage/overlay-simple-usage.example.component";
import { OverlayPopupStylesExampleComponent } from "../overlay-popup-styles/overlay-popup-styles.example.component";
import { OverlayViewportMarginExampleComponent } from "../overlay-viewport-margin/overlay-viewport-margin-example.component";
import { OverlayShowHideToggleExampleComponent } from "../overlay-show-hide-toggle/overlay-show-hide-toggle.example.component";
import { OverlayCustomStylesExampleComponent } from "../overlay-custom-styles/overlay-custom-styles.example.component";
import { OverlayCustomContainerExampleComponent } from "../overlay-custom-container/overlay-custom-container.example.component";
import { OverlayArrowExampleComponent } from "../overlay-arrow/overlay-arrow.example.component";
import { OverlayCustomDialogComponent } from "../overlay-custom-dialog/overlay-custom-dialog.component";
import { CustomConfirmationInsideDialogComponent } from "../overlay-custom-confirmation-inside-dialog/overlay-custom-confirmation-inside-dialog.component";

@Component({
    selector: "nui-overlay-docs-example",
    templateUrl: "./overlay-docs.example.component.html",
    imports: [NuiMessageModule, NuiDocsModule, OverlaySimpleExampleComponent, OverlayPopupStylesExampleComponent, OverlayViewportMarginExampleComponent, OverlayShowHideToggleExampleComponent, OverlayCustomStylesExampleComponent, OverlayCustomContainerExampleComponent, OverlayArrowExampleComponent, OverlayCustomDialogComponent, CustomConfirmationInsideDialogComponent]
})
export class OverlayDocsComponent {}
