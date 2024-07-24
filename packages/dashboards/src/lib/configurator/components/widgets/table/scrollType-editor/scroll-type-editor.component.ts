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
import {
    AbstractControl,
    FormBuilder,
    FormControl,
    FormGroup,
    Validators,
} from "@angular/forms";
import get from "lodash/get";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";

import {
    ITableWidgetPaginatorConfig,
    ScrollType,
} from "../../../../../components/table-widget/types";
import { IHasChangeDetector, IHasForm } from "../../../../../types";
import { ConfiguratorHeadingService } from "../../../../services/configurator-heading.service";
import { ScrollTypeEditorService } from "./scroll-type-editor.service";

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

    private pageSizeSetAll = [
        5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 60, 70, 80, 90, 100,
    ];
    public pageSizeSetOptions: IPageSizeSetMenuOption[] = [];
    public pageSizeOptions: number[] = [];
    public subtitle = "";
    public isExpanderOpen = false;
    public displayPageSizeSetErrorMessage = false;
    public displayPageSizeErrorMessage = false;

    public scrollTypeFormControl?: AbstractControl | null;
    public pageSizeSetFormControl?: AbstractControl | null;
    public pageSizeFormControl?: AbstractControl | null;

    constructor(
        private formBuilder: FormBuilder,
        public configuratorHeading: ConfiguratorHeadingService,
        public changeDetector: ChangeDetectorRef,
        public scrollTypeEditorService: ScrollTypeEditorService
    ) {
        this.updatePaginatorSelectOptions(this.pageSizeSetAll, false);
    }

    public ngOnChanges(changes: SimpleChanges): void {
        if (changes.scrollType) {
            this.scrollTypeFormControl?.setValue(this.scrollType, {
                emitEvent: false,
            });

            this.changeExpanderState(false);
            this.updateSubtitle();
            this.updateValidators();
        }

        if (changes.paginatorConfiguration) {
            this.updatePaginatorSelectOptions(
                this.paginatorConfiguration.pageSizeSet || [],
                true
            );
            this.updateDefaultPageSizeOptions(
                this.paginatorConfiguration.pageSizeSet || []
            );

            this.pageSizeSetFormControl?.setValue(
                this.paginatorConfiguration.pageSizeSet,
                {
                    emitEvent: false,
                }
            );

            this.pageSizeFormControl?.setValue(
                this.paginatorConfiguration.pageSize,
                {
                    emitEvent: true,
                }
            );
        }

        this.changeDetector.detectChanges();
    }

    public ngOnInit(): void {
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

        this.scrollTypeFormControl = this.form
            .get("paginatorConfiguration")
            ?.get("scrollType");

        this.pageSizeSetFormControl = this.form
            .get("paginatorConfiguration")
            ?.get("pageSizeSet");

        this.pageSizeFormControl = this.form
            .get("paginatorConfiguration")
            ?.get("pageSize");

        this.form.valueChanges
            .pipe(takeUntil(this.onDestroy$))
            .subscribe((val) => {
                this.displayPageSizeErrorMessage =
                    !!!val.paginatorConfiguration.pageSize;
            });

        this.updateSubtitle();

        this.scrollTypeFormControl?.valueChanges
            .pipe(takeUntil(this.onDestroy$))
            .subscribe((val) => {
                this.updateSubtitle();
                this.updateValidators();
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

        this.displayPageSizeSetErrorMessage =
            this.pageSizeSetOptions.filter((o) => o.checked).length === 0;

        this.emitUpdatedSelectedOptions();
    }

    public get hasPaginator() {
        return this.scrollTypeFormControl?.value === ScrollType.paginator;
    }

    public accordionToggle(isOpened: boolean) {
        this.changeExpanderState(false);
    }

    public changeExpanderState(isOpen: boolean) {
        this.isExpanderOpen = isOpen;
    }

    private updateSubtitle(): void {
        this.subtitle = this.scrollTypeEditorService.setAccordionSubtitleValues(
            this.hasVirtualScroll,
            this.scrollTypeFormControl?.value
        );
    }

    private updateValidators() {
        if (this.hasPaginator) {
            this.pageSizeFormControl?.addValidators(Validators.required);
            this.pageSizeSetFormControl?.addValidators(Validators.required);
        } else {
            this.pageSizeFormControl?.clearValidators();
            this.pageSizeSetFormControl?.clearValidators();
        }

        this.updatePaginatorSelectOptions(
            this.pageSizeSetFormControl?.value,
            true
        );
        this.updateDefaultPageSizeOptions(this.pageSizeSetFormControl?.value);

        this.pageSizeFormControl?.updateValueAndValidity();
        this.pageSizeSetFormControl?.updateValueAndValidity();
    }

    private emitUpdatedSelectedOptions() {
        let filteredPageSizeSet = this.pageSizeSetOptions
            .filter((o) => o.checked)
            .map((o) => o.value);

        this.updateDefaultPageSizeOptions(filteredPageSizeSet);
        this.pageSizeSetFormControl?.setValue(filteredPageSizeSet, {
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
        this.clearPageSizeSetOptions();

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

    private clearPageSizeSetOptions() {
        this.pageSizeSetOptions.forEach((option) => {
            option.checked = false;
        });
    }

    public ngOnDestroy(): void {
        this.onDestroy$.next();
        this.onDestroy$.complete();
    }
}
