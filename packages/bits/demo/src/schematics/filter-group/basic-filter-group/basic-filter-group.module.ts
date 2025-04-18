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

import {
    NuiButtonModule,
    NuiCheckboxModule,
    NuiDialogModule,
    NuiExpanderModule,
} from "@nova-ui/bits";

import { BasicFilterGroupCompositeComponent } from "./basic-filter-group.component";
import { FilterGroupCompositeDialogComponent } from "./filter-group-dialog/filter-group-dialog.component";
import { FilterGroupService } from "./filter-group.service";
import { BasicFilterGroupsWrapperComponent } from "./filter-groups-wrapper/filter-groups-wrapper.component";
import { ItemPickerCompositeModule } from "./item-picker/item-picker.module";

@NgModule({
    imports: [
        CommonModule,
        NuiCheckboxModule,
        NuiButtonModule,
        NuiDialogModule,
        ItemPickerCompositeModule,
        NuiExpanderModule,
        NuiCheckboxModule,
        BasicFilterGroupsWrapperComponent,
        FilterGroupCompositeDialogComponent,
        BasicFilterGroupCompositeComponent,
    ],
    exports: [
        BasicFilterGroupsWrapperComponent,
        FilterGroupCompositeDialogComponent,
        BasicFilterGroupCompositeComponent,
    ],
    providers: [FilterGroupService],
})
export class BasicFilterGroupCompositeModule {}
