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
    Input,
    OnChanges,
    Output,
    SimpleChanges,
    TemplateRef,
    ViewEncapsulation,
} from "@angular/core";
import _isNil from "lodash/isNil";
import { BehaviorSubject } from "rxjs";

import { IBrokerValue } from "../../providers/types";

export interface IKpiTileViewBroker {
    id: string;
    type?: "min" | "max";
    in$: BehaviorSubject<IBrokerValue>;
    out$: BehaviorSubject<IBrokerValue>;
}

@Component({
    selector: "nui-kpi-tile-view",
    templateUrl: "./kpi-tile-view.component.html",
    styleUrls: ["./kpi-tile-view.component.less"],
    encapsulation: ViewEncapsulation.Emulated,
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false,
})
export class KpiTileViewComponent implements OnChanges {
    @Input() public value: string | number | null;
    @Input() public label: string;
    @Input() public units: string;
    @Input() public backgroundColor: string;
    @Input() public textColor: string;
    @Input() public icon: string;
    @Input() public link: string;
    @Input() public interactive = false;
    @Input() public loading = false;
    @Input() public empty = false;
    @Input() public fontSize: string;
    @Input() public margin: number = 2;
    @Input() public syncValuesBroker: Array<IKpiTileViewBroker>;
    @Input() public valueTemplate: TemplateRef<any>;

    @Output() public tileClick = new EventEmitter<void>();

    public defaultColor = "var(--nui-color-bg-secondary)";

    public get computedTextColor(): string {
        return this.textColor || this.backgroundColor || this.defaultColor;
    }

    public get isInteractive(): boolean {
        return this.interactive && !this.showEmpty;
    }

    public get showEmpty(): boolean {
        if (this.empty) {
            return true;
        }

        if (typeof this.value === "boolean") {
            return false;
        }

        if (Array.isArray(this.value) && this.value.length === 0) {
            return true;
        }

        return _isNil(this.value) && this.value !== 0;
    }

    constructor(private changeDetector: ChangeDetectorRef) {}

    public ngOnChanges(_changes: SimpleChanges): void {
        this.changeDetector.markForCheck();
    }

    public onInteraction(): void {
        if (!this.isInteractive) {
            return;
        }
        this.tileClick.emit();
    }

    public getScaleBroker(id: string): IKpiTileViewBroker | undefined {
        if (this.syncValuesBroker) {
            return this.syncValuesBroker.find((b) => b.id === id);
        }
        return undefined;
    }
}
