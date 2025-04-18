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
import { NuiDocsModule } from "../../../../../../src/lib/docs/docs.module";
import { SimpleDialogExampleComponent } from "../simple-dialog/simple-dialog.example.component";
import { ComponentAsContentExampleComponent } from "../component-as-content/component-as-content.example.component";
import { DialogSeverityExampleComponent } from "../dialog-severity/dialog-severity.example.component";
import { HeaderButtonsExampleComponent } from "../header-buttons/header-buttons.example.component";
import { DialogSizesExampleComponent } from "../dialog-sizes/dialog-sizes.example.component";
import { DialogPositionExampleComponent } from "../dialog-position/dialog-position.example.component";
import { NuiMessageModule } from "../../../../../../src/lib/message/message.module";
import { DialogCustomClassExampleComponent } from "../dialog-custom-class/dialog-custom-class.example.component";
import { ConfirmationDialogExampleComponent } from "../confirmation-dialog/confirmation-dialog.example.component";
import { DialogWithKeyboardExampleComponent } from "../dialog-keyboard/dialog-with-keyboard.example.component";
import { DialogWithStaticBackdropExampleComponent } from "../dialog-static-backdrop/dialog-with-static-backdrop.example.component";
import { DialogInsideOverlayExampleComponent } from "../dialog-inside-overlay/dialog-inside-overlay.example.component";
import { DialogActionBeforeClosureExampleComponent } from "../dialog-actions-before-closure/dialog-actions-before-closure.example.component";
import { DialogAfterOpenedExampleComponent } from "../dialog-after-opened/dialog-after-opened.example.component";

@Component({
    templateUrl: "./dialog-docs.example.component.html",
    imports: [NuiDocsModule, SimpleDialogExampleComponent, ComponentAsContentExampleComponent, DialogSeverityExampleComponent, HeaderButtonsExampleComponent, DialogSizesExampleComponent, DialogPositionExampleComponent, NuiMessageModule, DialogCustomClassExampleComponent, ConfirmationDialogExampleComponent, DialogWithKeyboardExampleComponent, DialogWithStaticBackdropExampleComponent, DialogInsideOverlayExampleComponent, DialogActionBeforeClosureExampleComponent, DialogAfterOpenedExampleComponent]
})
export class DialogDocsComponent {}
