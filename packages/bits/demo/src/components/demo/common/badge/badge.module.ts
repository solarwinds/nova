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

import { ScrollingModule } from "@angular/cdk/scrolling";
import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";

import {
    NuiButtonModule,
    NuiDocsModule,
    NuiFormFieldModule,
    NuiMessageModule,
    NuiTextboxModule,
} from "@nova-ui/bits";

import { BadgeColorBlackComponent } from "./badge-color-black/badge-color-black.component";
import { BadgeCounterBasicComponent } from "./badge-counter-basic/badge-counter-basic.component";
import { BadgeCustomizationComponent } from "./badge-customization/badge-customization.component";
import { BadgeDocsComponent } from "./badge-docs/badge-docs.component";
import { BadgeEmptyBasicComponent } from "./badge-empty-basic/badge-empty-basic.component";
import { BadgeNovauiComponent } from "./badge-novaui/badge-novaui.component";
import { BadgeSystemStatusesComponent } from "./badge-system-statuses/badge-system-statuses.component";
import { BadgeVisualTestComponent } from "./badge-visual-test/badge-visual-test.component";

const routes = [
    {
        path: "",
        component: BadgeDocsComponent,
    },
    {
        path: "badge-visual-test",
        component: BadgeVisualTestComponent,
        data: {
            srlc: {
                hideIndicator: true,
            },
        },
    },
];

@NgModule({
    declarations: [
        BadgeDocsComponent,
        BadgeCounterBasicComponent,
        BadgeEmptyBasicComponent,
        BadgeSystemStatusesComponent,
        BadgeColorBlackComponent,
        BadgeCustomizationComponent,
        BadgeNovauiComponent,
        BadgeVisualTestComponent,
    ],
    imports: [
        NuiButtonModule,
        NuiFormFieldModule,
        NuiDocsModule,
        NuiMessageModule,
        NuiTextboxModule,
        ScrollingModule,
        RouterModule.forChild(routes),
    ],
    exports: [RouterModule],
})
export class BadgeModule {}
