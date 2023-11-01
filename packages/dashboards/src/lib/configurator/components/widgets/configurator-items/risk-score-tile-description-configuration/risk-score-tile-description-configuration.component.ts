// © 2023 SolarWinds Worldwide, LLC. All rights reserved.
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
    OnInit,
    Output,
    SimpleChanges,
} from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Observable } from "rxjs";

import { IHasChangeDetector, IHasForm } from "../../../../../types";

@Component({
    selector: "nui-risk-score-tile-description-configuration",
    templateUrl: "./risk-score-tile-description-configuration.component.html",
    styleUrls: ["./risk-score-tile-description-configuration.component.less"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RiskScoreTileDescriptionConfigurationComponent
    implements OnInit, OnChanges, IHasChangeDetector, IHasForm
{
    public static lateLoadKey =
        "RiskScoreTileDescriptionConfigurationComponent";

    public readonly MAX_DESCRIPTION_LENGTH = 150;

    @Input() componentId: string;

    @Input() label: string = "";
    @Input() minValue: number = 0;
    @Input() maxValue: number = 100;
    @Input() description: string = "";

    @Output() formReady = new EventEmitter<FormGroup>();

    public form: FormGroup;
    public subtitle$: Observable<string>;

    constructor(
        public changeDetector: ChangeDetectorRef,
        private formBuilder: FormBuilder
    ) {}

    public ngOnInit(): void {
        this.form = this.formBuilder.group({
            label: [this.label, [Validators.required]],
            minValue: [this.minValue, [Validators.required]],
            maxValue: [this.maxValue, [Validators.required]],
            description: [
                this.description,
                [Validators.maxLength(this.MAX_DESCRIPTION_LENGTH)],
            ],
        });

        this.formReady.emit(this.form);
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes.label) {
            this.form?.patchValue({ label: changes.label.currentValue });
        }

        if (changes.minValue) {
            this.form?.patchValue({ minValue: changes.minValue.currentValue });
        }

        if (changes.maxValue) {
            this.form?.patchValue({ maxValue: changes.maxValue.currentValue });
        }

        if (changes.description) {
            this.form?.patchValue({
                description: changes.description.currentValue,
            });
        }
    }
}
