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
import { RouterModule } from "@angular/router";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import {
    DEMO_PATH_TOKEN,
    NuiChipsModule,
    NuiColorPickerModule,
    NuiDocsModule,
    NuiIconModule,
    NuiPopoverModule,
    SrlcStage,
} from "@nova-ui/bits";
import { getDemoFiles } from "../../../static/demo-files-factory";
import { ColorPickerBasicExampleComponent } from "./color-picker-basic/color-picker-basic.example.component";
import { ColorPickerPaletteExampleComponent } from "./color-picker-palette/color-picker-palette.example.component";
import { ColorPickerExampleComponent } from "./color-picker-docs/color-picker-docs.example.component";
import { ColorPickerSelectExampleComponent } from "./color-picker-select/color-picker-select.example.component";

const routes = [
    {
        path: "",
        component: ColorPickerExampleComponent,
        data: {
            srlc: {
                stage: SrlcStage.beta,
            },
            showThemeSwitcher: true,
        },
    },
    {
        path: "color-picker-basic",
        component: ColorPickerBasicExampleComponent,
        data: {
            srlc: {
                stage: SrlcStage.beta,
            },
            showThemeSwitcher: true,
        },
    },
];

@NgModule({
    imports: [
        NuiColorPickerModule,
        NuiPopoverModule,
        NuiDocsModule,
        RouterModule.forChild(routes),
        NuiIconModule,
        FormsModule,
        ReactiveFormsModule,
    ],
    declarations: [
        ColorPickerExampleComponent,
        ColorPickerBasicExampleComponent,
        ColorPickerPaletteExampleComponent,
        ColorPickerSelectExampleComponent,
    ],
    providers: [
        {
            provide: DEMO_PATH_TOKEN,
            useValue: getDemoFiles("color-picker"),
        },
    ],
    exports: [RouterModule],
})
export default class ColorPickerModule {}
