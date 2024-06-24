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
    OnInit,
    Output,
    SimpleChanges,
} from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import get from "lodash/get";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";

import {
    ITableWidgetColumnConfig,
    ITableWidgetConfig,
    ITableWidgetPaginatorConfig,
    ITableWidgetSorterConfig,
    ScrollType,
} from "../../../../../components/table-widget/types";
import { IHasChangeDetector, IHasForm } from "../../../../../types";
import { ConfiguratorHeadingService } from "../../../../services/configurator-heading.service";

@Component({
    selector: "nui-scroll-type-editor-component",
    templateUrl: "scroll-type-editor.component.html",
    styleUrls: ["scroll-type-editor.component.less"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TableScrollTypeEditorComponent
    implements OnInit, OnChanges, OnDestroy, IHasForm, IHasChangeDetector
{
    static lateLoadKey = "TableScrollTypeEditorComponent";

    @Input() paginatorConfiguration: ITableWidgetPaginatorConfig;
    @Input() hasVirtualScroll: boolean;
    @Input() scrollType: ScrollType = ScrollType.virtual;

    @Output() formReady = new EventEmitter<FormGroup>();

    public form: FormGroup;
    private onDestroy$ = new Subject<void>();

    public loadStrategies = [
        {
            id: ScrollType.virtual,
            title: "Virtual scroll",
        },
        {
            id: ScrollType.paginator,
            title: "Paginator",
        },
        {
            id: ScrollType.default,
            title: "Default scroll",
        },
    ];

    constructor(
        private formBuilder: FormBuilder,
        public configuratorHeading: ConfiguratorHeadingService,
        public changeDetector: ChangeDetectorRef
    ) {}

    public ngOnInit(): void {
        this.form = this.formBuilder.group({
            paginatorConfiguration: this.formBuilder.group({
                scrollType: get(this.scrollType, "", ScrollType.virtual),
                pageSize: get(this.paginatorConfiguration, "pageSize", 10),
                // pageSizeSet: get(this.paginatorConfiguration, "pageSizeSet", [10, 20, 50]),
            }),
        });

        this.formReady.emit(this.form);
    }

    public ngOnChanges(changes: SimpleChanges): void {
        const scrollTypeFormControl = this.form
            .get("paginatorConfiguration")
            ?.get("scrollType");

        if (changes.scrollType) {
            scrollTypeFormControl?.setValue(this.scrollType, {
                emitEvent: false,
            });
        }

        this.changeDetector.detectChanges();
    }

    public ngOnDestroy(): void {
        this.onDestroy$.next();
        this.onDestroy$.complete();
    }
}
