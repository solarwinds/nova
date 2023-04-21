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
import { RouterModule, Routes } from "@angular/router";

// eslint-disable-next-line max-len
import {
    NuiButtonModule,
    NuiDocsModule,
    NuiMessageModule,
    NuiSwitchModule,
} from "@nova-ui/bits";
import { NuiDashboardsModule } from "@nova-ui/dashboards";

import { EmbeddedContentDocsComponent } from "./embedded-content-docs.component";
import { EmbeddedContentWidgetExampleComponent } from "./embedded-content-widget-example/embedded-content-widget-example.component";

const routes: Routes = [
    {
        path: "",
        component: EmbeddedContentDocsComponent,
        data: {
            srlc: {
                hideIndicator: true,
            },
        },
    },
    {
        path: "example",
        component: EmbeddedContentWidgetExampleComponent,
        data: {
            srlc: {
                hideIndicator: true,
            },
        },
    },
];

@NgModule({
    imports: [
        RouterModule.forChild(routes),
        NuiButtonModule,
        NuiDocsModule,
        NuiMessageModule,
        NuiDashboardsModule,
        NuiSwitchModule,
    ],
    declarations: [
        EmbeddedContentDocsComponent,
        EmbeddedContentWidgetExampleComponent,
    ],
})
export default class EmbeddedContentDocsModule {}
