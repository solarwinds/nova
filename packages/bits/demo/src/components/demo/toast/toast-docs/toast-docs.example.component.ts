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

import { IToastConfig, IToastDeclaration } from "@nova-ui/bits";
import { NuiDocsModule } from "../../../../../../src/lib/docs/docs.module";
import { ToastBasicExampleComponent } from "../toast-basic/toast-basic.example.component";
import { ToastBasicHtmlExampleComponent } from "../toast-basic-html/toast-basic-html.example.component";
import { ToastTypeExampleComponent } from "../toast-type/toast-type.example.component";
import { ToastConfigExampleComponent } from "../toast-config/toast-config.example.component";
import { NuiMessageModule } from "../../../../../../src/lib/message/message.module";
import { ToastPositionExampleComponent } from "../toast-position/toast-position.example.component";
import { ToastStickyErrorExampleComponent } from "../toast-sticky-error/toast-sticky-error.example.component";
import { ToastEventsExampleComponent } from "../toast-events/toast-events.example.component";

@Component({
    selector: "nui-toast-docs-example",
    templateUrl: "./toast-docs.example.component.html",
    imports: [NuiDocsModule, ToastBasicExampleComponent, ToastBasicHtmlExampleComponent, ToastTypeExampleComponent, ToastConfigExampleComponent, NuiMessageModule, ToastPositionExampleComponent, ToastStickyErrorExampleComponent, ToastEventsExampleComponent]
})
export class ToastExampleComponent {
    getToastDeclarationKey(key: keyof IToastDeclaration): string {
        return key;
    }
    getToastConfigKey(key: keyof IToastConfig): string {
        return key;
    }
}
