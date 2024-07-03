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
import { FormBuilder, FormControl, FormGroup } from "@angular/forms";
import get from "lodash/get";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";

import {
    ITableWidgetPaginatorConfig,
    ScrollType,
} from "../../../../../components/table-widget/types";
import { IHasChangeDetector, IHasForm } from "../../../../../types";
import { ConfiguratorHeadingService } from "../../../../services/configurator-heading.service";

export interface IPageSizeSetMenuOption {
    value: number;
    checked: boolean;
}
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
            title: $localize`Virtual scroll`,
        },
        {
            id: ScrollType.paginator,
            title: $localize`Paginator`,
        },
        {
            id: ScrollType.default,
            title: $localize`Default scroll`,
        },
    ];
    private pageSizeSetAll = [
        5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 60, 70, 80, 90, 100,
    ];
    public pageSizeSetOptions: IPageSizeSetMenuOption[] = [];
    public pageSizeOptions: number[] = [];
    public subtitle = "";
    public isExpanderOpen = false;

    constructor(
        private formBuilder: FormBuilder,
        public configuratorHeading: ConfiguratorHeadingService,
        public changeDetector: ChangeDetectorRef
    ) {
        this.updatePaginatorSelectOptions(this.pageSizeSetAll, false);
    }

    public ngOnChanges(changes: SimpleChanges): void {
        const scrollTypeFormControl = this.form
            .get("paginatorConfiguration")
            ?.get("scrollType");

        const pageSizeSetFormControl = this.form
            .get("paginatorConfiguration")
            ?.get("pageSizeSet");

        const pageSizeFormControl = this.form
            .get("paginatorConfiguration")
            ?.get("pageSize");

        if (changes.scrollType) {
            scrollTypeFormControl?.setValue(this.scrollType, {
                emitEvent: false,
            });

            this.changeExpanderState(false);
            this.setAccordionSubtitleValues();
        }

        if (changes.paginatorConfiguration) {
            const pageSizeSet = this.paginatorConfiguration.pageSizeSet;

            if (pageSizeSet) {
                this.updatePaginatorSelectOptions(pageSizeSet, true);
                this.updateDefaultPageSizeOptions(pageSizeSet);

                pageSizeSetFormControl?.setValue(pageSizeSet, {
                    emitEvent: false,
                });
            }

            pageSizeFormControl?.setValue(
                this.paginatorConfiguration.pageSize,
                {
                    emitEvent: false,
                }
            );
        }

        this.changeDetector.detectChanges();
    }

    public ngOnInit(): void {
        console.log("this.scrollType", this.scrollType);
        this.form = this.formBuilder.group({
            paginatorConfiguration: this.formBuilder.group({
                scrollType: get(this.scrollType, "", ScrollType.virtual),
                pageSize: get(this.paginatorConfiguration, "pageSize", 10),
                pageSizeSet: new FormControl(
                    get(
                        this.paginatorConfiguration,
                        "pageSizeSet",
                        [10, 20, 50]
                    )
                ),
            }),
        });

        this.form.valueChanges
            .pipe(takeUntil(this.onDestroy$))
            .subscribe((val) => {
                this.setAccordionSubtitleValues();
            });

        this.formReady.emit(this.form);
    }

    public onPageSizeSetChange(item: IPageSizeSetMenuOption): void {
        const option = this.pageSizeSetOptions.find(
            (n) => n.value === item.value
        );
        if (option) {
            option.checked = !item.checked;
        }

        this.emitUpdatedSelectedOptions();
    }

    public get hasPaginator() {
        return this.scrollType === ScrollType.paginator;
    }

    public accordionToggle(isOpened: boolean) {
        this.changeExpanderState(false);
    }

    public changeExpanderState(isOpen: boolean) {
        this.isExpanderOpen = isOpen;
    }

    private emitUpdatedSelectedOptions() {
        const pageSizeSetFormControl = this.form
            .get("paginatorConfiguration")
            ?.get("pageSizeSet");

        const filteredPageSizeSet = this.pageSizeSetOptions
            .filter((o) => o.checked)
            .map((o) => o.value);
        this.updateDefaultPageSizeOptions(filteredPageSizeSet);
        pageSizeSetFormControl?.setValue(filteredPageSizeSet, {
            emitEvent: false,
        });
    }

    private updateDefaultPageSizeOptions(options: number[]) {
        this.pageSizeOptions = options;
    }

    private updatePaginatorSelectOptions(
        options: number[],
        isChecked: boolean
    ) {
        options.forEach((o) => {
            const option = this.pageSizeSetOptions.find((po) => po.value === o);
            if (option) {
                option.checked = isChecked;
            } else {
                this.pageSizeSetOptions.push({
                    value: o,
                    checked: isChecked,
                });
            }
        });
    }

    private setAccordionSubtitleValues() {
        const prefix = $localize`Scroll Type: `;
        this.subtitle = this.hasVirtualScroll
            ? `${prefix} ${this.getScrollTypeTitle(ScrollType.virtual)}`
            : `${prefix} ${this.getScrollTypeTitle(this.scrollType)}`;
    }

    private getScrollTypeTitle(scrollType: ScrollType): string {
        return (
            this.loadStrategies.find((ls) => ls.id === scrollType)?.title ||
            $localize`Unknown`
        );
    }

    public ngOnDestroy(): void {
        this.onDestroy$.next();
        this.onDestroy$.complete();
    }
}
