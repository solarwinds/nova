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

import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    EventEmitter,
    Inject,
    Input,
    Output,
} from "@angular/core";

import { EventBus, IEvent } from "@nova-ui/bits";

import { DRILLDOWN } from "../../../../services/types";
import { PIZZAGNA_EVENT_BUS } from "../../../../types";
import { INavigationBarConfig } from "../../types";

@Component({
    selector: "nui-navigation-bar",
    templateUrl: "./list-navigation-bar.component.html",
    styleUrls: ["list-navigation-bar.component.less"],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false
})
export class ListNavigationBarComponent {
    static lateLoadKey = "ListNavigationBarComponent";

    @Input() public navBarConfig: INavigationBarConfig;

    @Output() public navigated = new EventEmitter();

    constructor(
        public changeDetector: ChangeDetectorRef,
        @Inject(PIZZAGNA_EVENT_BUS) private eventBus: EventBus<IEvent>
    ) {}

    public onBack(): void {
        if (this.navBarConfig) {
            this.eventBus.getStream(DRILLDOWN).next({
                payload: {
                    back: this.navBarConfig?.buttons?.back?.disabled,
                },
            });
        }
    }

    public onHome(): void {
        this.eventBus.getStream(DRILLDOWN).next({ payload: { reset: true } });
    }
}
