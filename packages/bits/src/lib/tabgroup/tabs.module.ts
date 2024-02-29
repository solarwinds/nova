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

import { NgModule } from "@angular/core";

import { TabHeadingCustomTemplateRefDirective } from "./tab/tab-heading-custom-template-ref.directive";
import { TabHeadingDirective } from "./tab/tab-heading.directive";
import { TabComponent } from "./tab/tab.component";
import { TabGroupComponent } from "./tab-group/tab-group.component";
import { TabHeadingComponent } from "./tab-heading/tab-heading.component";
import { TabHeadingGroupComponent } from "./tab-heading-group/tab-heading-group.component";
import { NuiCommonModule } from "../../common/common.module";
import { NuiIconModule } from "../icon/icon.module";

/**
 * @ignore
 */
@NgModule({
    declarations: [
        TabHeadingCustomTemplateRefDirective,
        TabHeadingDirective,
        TabComponent,
        TabGroupComponent,
        TabHeadingComponent,
        TabHeadingGroupComponent,
    ],
    imports: [NuiCommonModule, NuiIconModule],
    exports: [
        TabHeadingCustomTemplateRefDirective,
        TabHeadingDirective,
        TabComponent,
        TabGroupComponent,
        TabHeadingComponent,
        TabHeadingGroupComponent,
    ],
})
export class NuiTabsModule {}
