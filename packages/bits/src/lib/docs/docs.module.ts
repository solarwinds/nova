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

import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";

import { NuiCommonModule } from "../../common/common.module";
import { NuiButtonModule } from "../button/button.module";
import { NuiIconModule } from "../icon/icon.module";
import { NuiImageModule } from "../image/image.module";
import { NuiMessageModule } from "../message/message.module";
import { NuiSelectModule } from "../select/select.module";
import { NuiSwitchModule } from "../switch/switch.module";
import { NuiTabsModule } from "../tabgroup/tabs.module";
import { NuiToastModule } from "../toast/toast.module";
import { NuiTooltipModule } from "../tooltip/tooltip.module";
import { CopyTextComponent } from "./copy-text/copy-text.component";
import { ExampleCodeComponent } from "./example-code/example-code.component";
import { ExampleWrapperComponent } from "./example-wrapper/example-wrapper.component";
import { SrlcIndicatorComponent } from "./srlc-indicator/srlc-indicator.component";
import { ThemeSwitcherComponent } from "./theme-switcher/theme-switcher.component";

/**
 * @ignore
 */
@NgModule({
    imports: [
        CommonModule,
        RouterModule,
        NuiCommonModule,
        NuiMessageModule,
        NuiSelectModule,
        NuiTabsModule,
        NuiToastModule,
        NuiTooltipModule,
        NuiIconModule,
        NuiButtonModule,
        NuiSwitchModule,
        NuiImageModule,
    ],
    exports: [
        CommonModule,
        RouterModule,
        CopyTextComponent,
        ExampleWrapperComponent,
        SrlcIndicatorComponent,
        ThemeSwitcherComponent,
        ExampleCodeComponent,
    ],
    declarations: [
        CopyTextComponent,
        ExampleWrapperComponent,
        SrlcIndicatorComponent,
        ThemeSwitcherComponent,
        ExampleCodeComponent,
    ],
})
export class NuiDocsModule {}
