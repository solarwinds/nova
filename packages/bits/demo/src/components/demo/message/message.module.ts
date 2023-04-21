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

import {
    NuiButtonModule,
    NuiDocsModule,
    NuiMessageModule,
    SrlcStage,
} from "@nova-ui/bits";

import {
    MessageBasicExampleComponent,
    MessageCriticalExampleComponent,
    MessageDocsComponent,
    MessageInfoExampleComponent,
    MessageManualControlExampleComponent,
    MessageNotDismissableExampleComponent,
    MessageOkExampleComponent,
    MessageTestComponent,
    MessageVisualTestComponent,
    MessageWarningExampleComponent,
} from "./index";

const routes = [
    {
        path: "",
        component: MessageDocsComponent,
        data: {
            srlc: {
                stage: SrlcStage.ga,
            },
            showThemeSwitcher: true,
        },
    },
    {
        path: "message-test",
        component: MessageTestComponent,
        data: {
            srlc: {
                hideIndicator: true,
            },
        },
    },
    {
        path: "message-visual-test",
        component: MessageVisualTestComponent,
        data: {
            srlc: {
                hideIndicator: true,
            },
        },
    },
];

@NgModule({
    imports: [
        NuiButtonModule,
        NuiMessageModule,
        NuiDocsModule,
        RouterModule.forChild(routes),
    ],
    declarations: [
        MessageBasicExampleComponent,
        MessageCriticalExampleComponent,
        MessageDocsComponent,
        MessageInfoExampleComponent,
        MessageManualControlExampleComponent,
        MessageNotDismissableExampleComponent,
        MessageOkExampleComponent,
        MessageTestComponent,
        MessageVisualTestComponent,
        MessageWarningExampleComponent,
    ],
    exports: [RouterModule],
})
export default class MessageModule {}
