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
import { MessageBasicExampleComponent } from "../message-basic/message-basic.example.component";
import { MessageCriticalExampleComponent } from "../message-critical/message-critical.example.component";
import { MessageWarningExampleComponent } from "../message-warning/message-warning.example.component";
import { MessageOkExampleComponent } from "../message-ok/message-ok.example.component";
import { MessageInfoExampleComponent } from "../message-info/message-info.example.component";
import { MessageNotDismissableExampleComponent } from "../message-not-dismissable/message-not-dismissable.example.component";
import { MessageManualControlExampleComponent } from "../message-manual-control/message-manual-control.example.component";

@Component({
    selector: "nui-message-docs-example",
    templateUrl: "./message-docs.example.component.html",
    imports: [NuiDocsModule, MessageBasicExampleComponent, MessageCriticalExampleComponent, MessageWarningExampleComponent, MessageOkExampleComponent, MessageInfoExampleComponent, MessageNotDismissableExampleComponent, MessageManualControlExampleComponent]
})
export class MessageDocsComponent {}
