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
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";

import {
    EmbeddedContentMode,
    IInfoMessage,
} from "../../../../../components/types";
import { IHasChangeDetector, IHasForm } from "../../../../../types";

@Component({
    selector: "nui-embedded-content-configuration",
    templateUrl: "./embedded-content-configuration.component.html",
    styleUrls: ["./embedded-content-configuration.component.less"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmbeddedContentConfigurationComponent
    implements OnInit, OnChanges, IHasChangeDetector, IHasForm, OnDestroy
{
    public static lateLoadKey = "EmbeddedContentConfigurationComponent";

    @Input() mode = EmbeddedContentMode.URL;
    @Input() messageComponent: IInfoMessage;
    @Input() customEmbeddedContent: string;

    @Output() formReady = new EventEmitter<FormGroup>();

    private destroyed$ = new Subject<void>();

    public form: FormGroup = this.formBuilder.group({
        mode: [this.mode],
        urlCustomContent: [""],
        htmlCustomContent: [""],
        customEmbeddedContent: [""],
    });

    public modes = [
        {
            value: EmbeddedContentMode.URL,
            displayValue: $localize`Show the contents of a specific URL`,
        },
        {
            value: EmbeddedContentMode.HTML,
            displayValue: $localize`Show the exact HTML I supply below`,
        },
    ];

    get urlCustomContent() {
        return this.form.get("urlCustomContent");
    }

    get htmlCustomContent() {
        return this.form.get("htmlCustomContent");
    }

    get modeValue() {
        return this.form.get("mode");
    }

    get customEmbeddedContentValue() {
        return this.form.get("customEmbeddedContent");
    }

    constructor(
        public changeDetector: ChangeDetectorRef,
        private formBuilder: FormBuilder
    ) {}

    public ngOnInit(): void {
        this.initializeForm();
        this.formReady.emit(this.form);
    }

    public ngOnChanges(changes: SimpleChanges): void {
        if (changes.customEmbeddedContent) {
            if (this.mode === EmbeddedContentMode.URL) {
                this.urlCustomContent?.setValue(this.customEmbeddedContent);
            } else if (this.mode === EmbeddedContentMode.HTML) {
                this.htmlCustomContent?.setValue(this.customEmbeddedContent);
            }
        }

        if (changes.mode) {
            this.modeValue?.setValue(changes.mode.currentValue);
        }
    }

    public ngOnDestroy() {
        this.destroyed$.next();
        this.destroyed$.complete();
    }

    private initializeForm() {
        this.modeValue?.valueChanges
            .pipe(takeUntil(this.destroyed$))
            .subscribe((value) => {
                if (value === EmbeddedContentMode.URL) {
                    this.customEmbeddedContentValue?.setValue(
                        this.form.get("urlCustomContent")?.value
                    );
                    this.htmlCustomContent?.disable();
                    this.urlCustomContent?.enable();
                } else if (value === EmbeddedContentMode.HTML) {
                    this.customEmbeddedContentValue?.setValue(
                        this.form.get("htmlCustomContent")?.value
                    );
                    this.urlCustomContent?.disable();
                    this.htmlCustomContent?.enable();
                }
            });

        this.urlCustomContent?.valueChanges
            .pipe(takeUntil(this.destroyed$))
            .subscribe((value) => {
                this.customEmbeddedContentValue?.setValue(value);
            });

        this.htmlCustomContent?.valueChanges
            .pipe(takeUntil(this.destroyed$))
            .subscribe((value) => {
                this.customEmbeddedContentValue?.setValue(value);
            });
    }
}
