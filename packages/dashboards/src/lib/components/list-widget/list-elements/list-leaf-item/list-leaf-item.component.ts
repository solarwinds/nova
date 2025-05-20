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
    OnInit,
    Output,
} from "@angular/core";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";

import { EventBus, IEvent } from "@nova-ui/bits";

import { WIDGET_SEARCH } from "../../../../services/types";
import { IHasChangeDetector, PIZZAGNA_EVENT_BUS } from "../../../../types";

@Component({
    selector: "nui-list-leaf-item",
    templateUrl: "./list-leaf-item.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush,
    host: { class: "w-100" },
    styleUrls: ["list-leaf-item.component.less"],
})
export class ListLeafItemComponent implements IHasChangeDetector, OnInit {
    static lateLoadKey = "ListLeafItemComponent";

    @Input() public icon: string;
    @Input() public status: string;
    @Input() public detailedUrl: string;
    @Input() public label: string;
    @Input() public canNavigate: boolean;
    @Input() public url: string;

    @Output() public navigated = new EventEmitter<ListLeafItemComponent>();

    public searchTerm: string = "";
    protected readonly destroy$ = new Subject<void>();

    public onButtonClick(): void {
        if (this.canNavigate) {
            this.navigated.emit(this);
        }
    }

    constructor(
        public changeDetector: ChangeDetectorRef,
        @Inject(PIZZAGNA_EVENT_BUS) public eventBus: EventBus<IEvent>
    ) {}

    public ngOnInit(): void {
        this.eventBus
            .getStream(WIDGET_SEARCH)
            .pipe(takeUntil(this.destroy$))
            .subscribe((event) => {
                this.searchTerm = event.payload ?? "";
                this.changeDetector.markForCheck();
            });
    }
}
