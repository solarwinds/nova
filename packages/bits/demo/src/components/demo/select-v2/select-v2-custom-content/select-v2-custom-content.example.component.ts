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

import { ChangeDetectionStrategy, Component, Inject } from "@angular/core";

import { ToastService } from "@nova-ui/bits";

@Component({
    selector: "nui-select-v2-custom-content-example",
    templateUrl: "./select-v2-custom-content.example.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush,
    styleUrls: ["select-v2-custom-content.example.component.less"],
})
export class SelectV2CustomContentExampleComponent {
    public items = [
        {
            headerName: $localize`Saved Data Filters`,
            options: [
                {
                    id: 1,
                    name: $localize`All Services`,
                    icon: "check",
                },
                {
                    id: 2,
                    name: $localize`Unified Communication Apps`,
                    icon: "execute",
                },
            ],
        },
    ];

    constructor(@Inject(ToastService) private toastService: ToastService) {}

    public actionSimulation(event: Event) {
        this.toastService.info({
            message: $localize`Action Occurred!`,
        });
        event?.stopPropagation();
    }
}
