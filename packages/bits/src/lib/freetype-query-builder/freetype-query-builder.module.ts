// © 2023 SolarWinds Worldwide, LLC. All rights reserved.
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
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { FreetypeQueryBuilderComponent } from "./freetype-query-builder.component";
import { FreeTypeQueryUtilsService } from "./helpers/freetype-query-utils.service";
import { windowProvider, WindowToken } from "./helpers/window";
import { TextHighlightOverlayComponent } from "./text-highlight-overlay/text-highlight-overlay-component";
import { NuiCommonModule } from "../../common/common.module";
import { NuiDividerModule } from "../divider/divider.module";
import { NuiFormFieldModule } from "../form-field/form-field.module";
import { NuiIconModule } from "../icon/icon.module";
import { NuiMenuModule } from "../menu/menu.module";
import { NuiPopupModule } from "../popup/popup.module";
import { NuiSelectV2Module } from "../select-v2/select-v2.module";
import { NuiToastModule } from "../toast/toast.module";

/**
 * @ignore
 */
@NgModule({
    declarations: [
        FreetypeQueryBuilderComponent,
        TextHighlightOverlayComponent,
    ],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        NuiCommonModule,
        NuiFormFieldModule,
        NuiToastModule,
        NuiDividerModule,
        NuiIconModule,
        NuiMenuModule,
        NuiPopupModule,
        NuiSelectV2Module,
    ],
    providers: [
        FreeTypeQueryUtilsService,
        { provide: WindowToken, useFactory: windowProvider },
    ],
    exports: [FreetypeQueryBuilderComponent, TextHighlightOverlayComponent],
})
export class NuiFreetypeQueryModule {}
