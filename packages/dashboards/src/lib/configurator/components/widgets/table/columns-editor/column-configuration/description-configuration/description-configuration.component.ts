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
import { FormBuilder, FormGroup, Validators } from "@angular/forms";

import { IHasChangeDetector } from "../../../../../../../types";

@Component({
    selector: "nui-table-column-description-configuration",
    templateUrl: "./description-configuration.component.html",
    styleUrls: ["./description-configuration.component.less"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DescriptionConfigurationComponent
    implements OnInit, OnDestroy, OnChanges, IHasChangeDetector
{
    static lateLoadKey = "DescriptionConfigurationComponent";

    @Input() label: string;
    @Input() isActive: string;
    @Input() width: number;
    @Input() isWidthMessageDisplayed: boolean;

    @Output() formReady: EventEmitter<FormGroup> =
        new EventEmitter<FormGroup>();
    @Output() formDestroy: EventEmitter<FormGroup> =
        new EventEmitter<FormGroup>();

    public form: FormGroup;

    constructor(
        private formBuilder: FormBuilder,
        public changeDetector: ChangeDetectorRef
    ) {}

    ngOnInit(): void {
        this.form = this.formBuilder.group({
            label: [this.label || null, [Validators.required]],
            isActive: this.isActive ?? true,
            width: this.width || undefined,
        });

        this.formReady.emit(this.form);
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes.label) {
            this.form?.patchValue({ label: changes.label.currentValue });
        }
        if (changes.isActive) {
            this.form?.patchValue({ isActive: changes.isActive.currentValue });
        }
        if (changes.width) {
            this.form?.patchValue({ width: changes.width.currentValue });
        }
    }

    public stub() {}

    ngOnDestroy(): void {
        this.formDestroy.emit(this.form);
    }
}
