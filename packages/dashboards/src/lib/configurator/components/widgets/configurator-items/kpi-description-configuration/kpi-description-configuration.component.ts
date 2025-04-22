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
    OnInit,
    Output,
    SimpleChanges,
} from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
// eslint-disable-next-line import/no-deprecated
import { combineLatest, Observable } from "rxjs";
// eslint-disable-next-line import/no-deprecated
import { map, startWith } from "rxjs/operators";

import {
    chartPaletteColorMap,
    DEFAULT_KPI_TILE_COLOR,
} from "../../../../../constants/default-palette";
import {
    IHasChangeDetector,
    IHasForm,
    IPaletteColor,
} from "../../../../../types";

@Component({
    selector: "nui-kpi-description-configuration",
    templateUrl: "./kpi-description-configuration.component.html",
    styleUrls: ["./kpi-description-configuration.component.less"],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false
})
export class KpiDescriptionConfigurationComponent
    implements OnInit, OnChanges, IHasChangeDetector, IHasForm
{
    public static lateLoadKey = "KpiDescriptionConfigurationComponent";
    public defaultColor = {
        label: $localize`Default color`,
        color: DEFAULT_KPI_TILE_COLOR,
    };

    @Input() componentId: string;
    @Input() configurableUnits: boolean;

    @Input() label: string = "";
    @Input() backgroundColor: string = this.defaultColor.color;
    @Input() units: string = "";
    @Input() backgroundColors: IPaletteColor[];

    @Output() formReady = new EventEmitter<FormGroup>();

    public form: FormGroup;
    public subtitle$: Observable<string>;

    constructor(
        public changeDetector: ChangeDetectorRef,
        private formBuilder: FormBuilder
    ) {}

    public ngOnInit(): void {
        this.backgroundColors = [...this.backgroundColors];
        this.backgroundColors.unshift(this.defaultColor);

        this.form = this.formBuilder.group({
            label: [this.label, [Validators.required]],
            backgroundColor: [this.backgroundColor, [Validators.required]],
        });

        if (this.configurableUnits) {
            this.form.addControl("units", this.formBuilder.control(this.units));
        }

        const label = this.form.get("label");
        // eslint-disable-next-line import/no-deprecated
        const labelValue = label?.valueChanges.pipe(startWith(label.value));

        const backgroundColor = this.form.get("backgroundColor");
        const backgroundColorValue = backgroundColor?.valueChanges.pipe(
            // eslint-disable-next-line import/no-deprecated
            startWith(backgroundColor?.value)
        );
        // eslint-disable-next-line import/no-deprecated
        this.subtitle$ = combineLatest([
            labelValue?.pipe(map((t) => t || $localize`no label`)),
            backgroundColorValue?.pipe(
                map((t) => chartPaletteColorMap[t] || $localize`Default Color`)
            ),
        ]).pipe(map((labels) => labels.join(", ")));

        this.formReady.emit(this.form);
    }

    public ngOnChanges(changes: SimpleChanges): void {
        if (changes.label) {
            this.form?.patchValue({ label: changes.label.currentValue });
        }
        if (changes.backgroundColor) {
            this.form?.patchValue({
                backgroundColor: changes.backgroundColor.currentValue,
            });
        }
        if (changes.units) {
            this.form?.patchValue({ units: changes.units.currentValue });
        }
    }
}
