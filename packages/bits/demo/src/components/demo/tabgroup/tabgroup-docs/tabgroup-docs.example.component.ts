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

import { Component } from "@angular/core";
import { NuiMessageModule } from "../../../../../../src/lib/message/message.module";
import { NuiDocsModule } from "../../../../../../src/lib/docs/docs.module";
import { TabHeadingGroupHorizontalExampleComponent } from "../tab-heading-group-horizontal/tab-heading-group-horizontal.example.component";
import { TabHeadingGroupHorizontalWithIconsExampleComponent } from "../tab-heading-group-horizontal-with-icons/tab-heading-group-horizontal-with-icons.example.component";
import { TabHeadingGroupHorizontalWithIconsOnlyExampleComponent } from "../tab-heading-group-horizontal-with-icons-only/tab-heading-group-horizontal-with-icons-only.example.component";
import { TabHeadingGroupVerticalExampleComponent } from "../tab-heading-group-vertical/tab-heading-group-vertical.example.component";
import { TabHeadingGroupVerticalWithIconsExampleComponent } from "../tab-heading-group-vertical-with-icons/tab-heading-group-vertical-with-icons.example.component";
import { TabHeadingGroupWithIconsExampleComponent } from "../tab-heading-group-with-icons/tab-heading-group-with-icons.example.component";
import { TabHeadingGroupResponsiveExampleComponent } from "../tab-heading-group-responsive/tab-heading-group-responsive.example.component";
import { TabHeadingGroupWithContentExampleComponent } from "../tab-heading-group-with-content/tab-heading-group-with-content.example.component";
import { TabHeadingGroupDynamicExampleComponent } from "../tab-heading-group-dynamic/tab-heading-group-dynamic.example.component";
import { NuiExpanderModule } from "../../../../../../src/lib/expander/expander.module";
import { TabHeadingGroupWithRouterExampleComponent } from "../tab-heading-group-with-router/tab-heading-group-with-router.example.component";

@Component({
    selector: "nui-tabgroup-example",
    templateUrl: "./tabgroup-docs.example.component.html",
    imports: [NuiMessageModule, NuiDocsModule, TabHeadingGroupHorizontalExampleComponent, TabHeadingGroupHorizontalWithIconsExampleComponent, TabHeadingGroupHorizontalWithIconsOnlyExampleComponent, TabHeadingGroupVerticalExampleComponent, TabHeadingGroupVerticalWithIconsExampleComponent, TabHeadingGroupWithIconsExampleComponent, TabHeadingGroupResponsiveExampleComponent, TabHeadingGroupWithContentExampleComponent, TabHeadingGroupDynamicExampleComponent, NuiExpanderModule, TabHeadingGroupWithRouterExampleComponent]
})
export class TabgroupDocsExampleComponent {
    public tabsRouteConfig: string = `
    children: [
        {
            path: "",
            redirectTo: "tab-settings",
            // pathMatch strategy is used here because we redirect to another route from an empty path.
            // For more info please refer to these docs: https://angular.io/api/router/Route#pathMatch
            pathMatch: "full",
        },
        {
            path: "tab-settings",
            component: TabContentSettingsExampleComponent,
        },
        {
            path: "tab-statistics",
            component: TabContentStatisticsExampleComponent,
        },
        {
            path: "tab-about",
            component: TabContentAboutExampleComponent,
        },
    ],`;
}
