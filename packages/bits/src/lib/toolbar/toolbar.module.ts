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

import { NuiCommonModule } from "../../common/common.module";
import { NuiButtonModule } from "../button/button.module";
import { NuiDividerModule } from "../divider/divider.module";
import { NuiIconModule } from "../icon/icon.module";
import { NuiMenuModule } from "../menu/menu.module";
import { ToolbarGroupComponent } from "./toolbar-group.component";
import { ToolbarItemComponent } from "./toolbar-item.component";
import { ToolbarMessageComponent } from "./toolbar-message.component";
import { ToolbarSplitterComponent } from "./toolbar-splitter.component";
import { ToolbarComponent } from "./toolbar.component";

/**
 * @ignore
 */
@NgModule({
    imports: [
        NuiCommonModule,
        NuiIconModule,
        NuiMenuModule,
        NuiDividerModule,
        NuiButtonModule,
    ],
    declarations: [
        ToolbarComponent,
        ToolbarItemComponent,
        ToolbarMessageComponent,
        ToolbarSplitterComponent,
        ToolbarGroupComponent,
    ],
    exports: [
        ToolbarComponent,
        ToolbarItemComponent,
        ToolbarMessageComponent,
        ToolbarSplitterComponent,
        ToolbarGroupComponent,
    ],
    providers: [],
})
export class NuiToolbarModule {}
