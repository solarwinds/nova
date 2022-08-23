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
import { combineLatest, Observable } from "rxjs";
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
        const labelValue = label?.valueChanges.pipe(startWith(label.value));

        const backgroundColor = this.form.get("backgroundColor");
        const backgroundColorValue = backgroundColor?.valueChanges.pipe(
            startWith(backgroundColor?.value)
        );
        this.subtitle$ = combineLatest([
            labelValue?.pipe(map((t) => t || $localize`no label`)),
            backgroundColorValue?.pipe(
                map((t) => chartPaletteColorMap[t] || $localize`Default Color`)
            ),
        ]).pipe(map((labels) => labels.join(", ")));

        this.formReady.emit(this.form);
    }

    ngOnChanges(changes: SimpleChanges): void {
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
