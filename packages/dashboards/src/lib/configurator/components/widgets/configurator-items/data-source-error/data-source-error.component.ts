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
    OnDestroy,
    Output,
    SimpleChanges,
} from "@angular/core";
import isUndefined from "lodash/isUndefined";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";

import { IDataSource } from "@nova-ui/bits";

import { IDataSourceError } from "../../../../../components/providers/types";

@Component({
    selector: "nui-data-source-error",
    templateUrl: "./data-source-error.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false
})
export class DataSourceErrorComponent implements OnDestroy, OnChanges {
    public static lateLoadKey = "DataSourceErrorComponent";

    @Input() public dataSource: IDataSource;
    @Output() public errorState = new EventEmitter<boolean>();

    public dataSourceError: IDataSourceError | null;
    public busy: boolean;
    public onDestroy$: Subject<void> = new Subject<void>();
    public data: any;

    private dataSourceClear$: Subject<void> = new Subject<void>();

    constructor(public changeDetector: ChangeDetectorRef) {}

    public ngOnChanges(changes: SimpleChanges): void {
        if (changes.dataSource) {
            this.onDataSourceChanged();
        }
    }

    public onDataSourceChanged(): void {
        this.dataSourceClear$.next();

        this.dataSource?.busy
            ?.pipe(takeUntil(this.dataSourceClear$))
            .subscribe((isBusy: boolean) => {
                this.busy = isBusy;
                this.changeDetector.markForCheck();
            });

        this.dataSource?.outputsSubject
            .pipe(takeUntil(this.dataSourceClear$))
            .subscribe((value) => {
                this.data = isUndefined(value?.result) ? value : value?.result;
                this.dataSourceError = value?.error;
                this.errorState.emit(!!this.dataSourceError);
                this.changeDetector.markForCheck();
            });
    }

    public ngOnDestroy(): void {
        this.onDestroy$.next();
        this.onDestroy$.complete();
        this.dataSourceClear$.next();
        this.dataSourceClear$.complete();
    }
}
