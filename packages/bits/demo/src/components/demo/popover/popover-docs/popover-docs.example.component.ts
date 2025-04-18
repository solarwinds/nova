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
import { PopoverBasicUsageExampleComponent } from "../popover-basic-usage/popover-basic-usage.example.component";
import { PopoverDebounceExampleComponent } from "../popover-debounce/popover-debounce.example.component";
import { PopoverWithTitleExampleComponent } from "../popover-with-title/popover-with-title.example.component";
import { PopoverClickTriggerExampleComponent } from "../popover-click-trigger/popover-click-trigger.example.component";
import { PopoverMouseenterTriggerExampleComponent } from "../popover-mouseenter-trigger/popover-mouseenter-trigger.example.component";
import { PopoverFocusTriggerExampleComponent } from "../popover-focus-trigger/popover-focus-trigger.example.component";
import { PopoverPreventCloseOnClickExampleComponent } from "../popover-prevent-close-on-click/popover-prevent-close-on-click.example.component";
import { PopoverWithContainerExampleComponent } from "../popover-with-container/popover-with-container.example.component";
import { PopoverNoPaddingExampleComponent } from "../popover-no-padding/popover-no-padding.example.component";
import { PopoverUnlimitedExampleComponent } from "../popover-unlimited/popover-unlimited.example.component";
import { PopoverOutputsExampleComponent } from "../popover-outputs/popover-outputs.example.component";
import { PopoverPlacementExampleComponent } from "../popover-placement/popover-placement.example.component";
import { PopoverIconExampleComponent } from "../popover-icon/popover-icon.example.component";
import { PopoverStatusExampleComponent } from "../popover-status/popover-status.example.component";
import { PopoverModalExampleComponent } from "../popover-modal/popover-modal.example.component";
import { PopoverDisabledExampleComponent } from "../popover-disabled/popover-disabled.example.component";
import { PopoverOpenAndCloseProgrammaticallyExampleComponent } from "../popover-open-and-close-programmatically/popover-open-and-close-programmatically.example.component";

@Component({
    selector: "nui-popover-docs-example",
    templateUrl: "./popover-docs.example.component.html",
    imports: [NuiDocsModule, PopoverBasicUsageExampleComponent, PopoverDebounceExampleComponent, PopoverWithTitleExampleComponent, PopoverClickTriggerExampleComponent, PopoverMouseenterTriggerExampleComponent, PopoverFocusTriggerExampleComponent, PopoverPreventCloseOnClickExampleComponent, PopoverWithContainerExampleComponent, PopoverNoPaddingExampleComponent, PopoverUnlimitedExampleComponent, PopoverOutputsExampleComponent, PopoverPlacementExampleComponent, PopoverIconExampleComponent, PopoverStatusExampleComponent, PopoverModalExampleComponent, PopoverDisabledExampleComponent, PopoverOpenAndCloseProgrammaticallyExampleComponent]
})
export class PopoverExampleComponent {}
