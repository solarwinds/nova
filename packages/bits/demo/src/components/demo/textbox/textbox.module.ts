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
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";

import {
    NuiDocsModule,
    NuiFormFieldModule,
    NuiMessageModule,
    NuiTextboxModule,
    SrlcStage,
} from "@nova-ui/bits";

import {
    TextboxAreaExampleComponent,
    TextboxBasicExampleComponent,
    TextboxCustomBoxWidthExampleComponent,
    TextboxDisabledExampleComponent,
    TextboxDocsExampleComponent,
    TextboxGettingValueExampleComponent,
    TextboxHintExampleComponent,
    TextboxInfoExampleComponent,
    TextboxNumberBasicExampleComponent,
    TextboxNumberDocsExampleComponent,
    TextboxNumberMinMaxExampleComponent,
    TextboxNumberTestComponent,
    TextboxNumberVisualTestComponent,
    TextboxPlaceholderExampleComponent,
    TextboxReadonlyExampleComponent,
    TextboxRequiredExampleComponent,
    TextboxVisualTestComponent,
} from "./index";

const routes = [
    {
        path: "",
        component: TextboxDocsExampleComponent,
        data: {
            srlc: {
                stage: SrlcStage.ga,
            },
            showThemeSwitcher: true,
        },
    },
    {
        path: "textbox-number",
        component: TextboxNumberDocsExampleComponent,
        data: {
            srlc: {
                stage: SrlcStage.ga,
            },
            showThemeSwitcher: true,
        },
    },
    {
        path: "textbox-visual-test",
        component: TextboxVisualTestComponent,
        data: {
            srlc: {
                hideIndicator: true,
            },
        },
    },
    {
        path: "textbox-number-test",
        component: TextboxNumberTestComponent,
    },
    {
        path: "textbox-number-visual-test",
        component: TextboxNumberVisualTestComponent,
        data: {
            srlc: {
                hideIndicator: true,
            },
        },
    },
];

@NgModule({
    imports: [
        NuiTextboxModule,
        NuiFormFieldModule,
        FormsModule,
        ReactiveFormsModule,
        NuiMessageModule,
        NuiDocsModule,
        RouterModule.forChild(routes),
    ],
    declarations: [
        TextboxAreaExampleComponent,
        TextboxCustomBoxWidthExampleComponent,
        TextboxDocsExampleComponent,
        TextboxDisabledExampleComponent,
        TextboxHintExampleComponent,
        TextboxInfoExampleComponent,
        TextboxNumberDocsExampleComponent,
        TextboxNumberMinMaxExampleComponent,
        TextboxNumberBasicExampleComponent,
        TextboxNumberTestComponent,
        TextboxPlaceholderExampleComponent,
        TextboxBasicExampleComponent,
        TextboxRequiredExampleComponent,
        TextboxReadonlyExampleComponent,
        TextboxVisualTestComponent,
        TextboxNumberVisualTestComponent,
        TextboxGettingValueExampleComponent,
    ],
    exports: [RouterModule],
})
export default class TextboxModule {}
