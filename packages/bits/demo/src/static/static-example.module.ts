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
import { RouterModule, Routes } from "@angular/router";

import { NuiCommonModule, NuiDocsModule } from "@nova-ui/bits";
import { NuiDividerModule } from "@nova-ui/bits";
import { SrlcStage } from "@nova-ui/bits";
import { NuiIconModule } from "@nova-ui/bits";
import { NuiMessageModule } from "@nova-ui/bits";
import { NuiToastModule } from "@nova-ui/bits";
import { NuiExpanderModule } from "@nova-ui/bits";
import { NuiFormFieldModule } from "@nova-ui/bits";
import { NuiTextboxModule } from "@nova-ui/bits";
import { NuiValidationMessageModule } from "@nova-ui/bits";
import { NuiButtonModule } from "@nova-ui/bits";

import { FrameworkColorsDarkExampleComponent } from "./framework-colors-dark/framework-colors-dark.example.component";
import { FrameworkColorsExampleComponent } from "./framework-colors/framework-colors-example.component";
import { LinksExampleComponent } from "./links/links.example.component";
import { SemanticVariablesExampleComponent } from "./semantic-variables/semantic-variables.example.component";
import { TypographyExampleComponent } from "./typography/typography-example.component";

const staticRoutes: Routes = [
    {
        path: "typography",
        component: TypographyExampleComponent,
        data: {
            srlc: {
                stage: SrlcStage.ga,
            },
        },
    },
    {
        path: "semantic-variables",
        component: SemanticVariablesExampleComponent,
        data: {
            srlc: {
                stage: SrlcStage.ga,
            },
        },
    },
    {
        path: "framework-colors",
        component: FrameworkColorsExampleComponent,
        data: {
            srlc: {
                stage: SrlcStage.ga,
            },
        },
    },
    {
        path: "framework-colors-dark",
        component: FrameworkColorsDarkExampleComponent,
        data: {
            srlc: {
                stage: SrlcStage.ga,
            },
        },
    },
    {
        path: "links",
        component: LinksExampleComponent,
        data: {
            srlc: {
                stage: SrlcStage.ga,
            },
        },
    },
];

@NgModule({
    declarations: [
        TypographyExampleComponent,
        SemanticVariablesExampleComponent,
        FrameworkColorsExampleComponent,
        FrameworkColorsDarkExampleComponent,
        LinksExampleComponent,
    ],
    imports: [
        NuiIconModule,
        CommonModule,
        NuiDocsModule,
        NuiCommonModule,
        NuiDividerModule,
        NuiMessageModule,
        NuiToastModule,
        NuiExpanderModule,
        NuiFormFieldModule,
        NuiTextboxModule,
        NuiButtonModule,
        NuiValidationMessageModule,
        RouterModule.forChild(staticRoutes),
    ],
})
export default class StaticExampleModule {}
