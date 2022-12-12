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
import { FormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";

import {
    NuiDocsModule,
    NuiFormFieldModule,
    NuiMessageModule,
    NuiTextboxModule,
    SrlcStage,
} from "@nova-ui/bits";

import { UnitConversionServiceDocsComponent } from "./docs/unit-conversion-service-docs.component";
import { UnitConversionServiceBasicExampleComponent } from "./unit-conversion-service-basic/unit-conversion-service-basic.example.component";
import { UnitConversionServiceSeparateUnitDisplayExampleComponent } from "./unit-conversion-service-separate-unit-display/unit-conversion-service-separate-unit-display.example.component";

const routes = [
    {
        path: "",
        component: UnitConversionServiceDocsComponent,
        data: {
            srlc: {
                stage: SrlcStage.ga,
            },
            showThemeSwitcher: true,
        },
    },
    {
        path: "basic",
        component: UnitConversionServiceBasicExampleComponent,
        data: {
            srlc: {
                hideIndicator: true,
            },
            showThemeSwitcher: true,
        },
    },
    {
        path: "separate-unit-display",
        component: UnitConversionServiceSeparateUnitDisplayExampleComponent,
        data: {
            srlc: {
                hideIndicator: true,
            },
            showThemeSwitcher: true,
        },
    },
];

@NgModule({
    declarations: [
        UnitConversionServiceDocsComponent,
        UnitConversionServiceBasicExampleComponent,
        UnitConversionServiceSeparateUnitDisplayExampleComponent,
    ],
    imports: [
        FormsModule,
        NuiDocsModule,
        NuiFormFieldModule,
        NuiMessageModule,
        NuiTextboxModule,
        RouterModule.forChild(routes),
    ],
    exports: [RouterModule],
})
export class UnitConversionServiceExampleModule {}
