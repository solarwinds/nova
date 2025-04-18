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

import { Component, Input } from "@angular/core";
import { NuiContentModule } from "../../../../../../../../src/lib/content/content.module";
import { NuiSwitchModule } from "../../../../../../../../src/lib/switch/switch.module";

@Component({
    selector: "nui-content-statistics-example",
    templateUrl: "./tab-content-statistics.example.component.html",
    imports: [NuiContentModule, NuiSwitchModule]
})
export class TabContentStatisticsExampleComponent {
    public tabTitle: string = "Statistics Options";

    public content: string = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam sed erat eget
    velit elementum ultricies vitae vel mauris. Nam egestas fermentum ex id interdum.
    In in dignissim libero. Suspendisse commodo pellentesque purus, sit amet tempor enim`;

    @Input() public isFirstOn: boolean = false;
    @Input() public isSecondOn: boolean = true;
    @Input() public isThirdOn: boolean = false;
}
