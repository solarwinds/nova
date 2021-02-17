import { CdkDragDrop, CdkDragStart } from "@angular/cdk/drag-drop";
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from "@angular/core";
import { FormArray, FormBuilder, FormGroup, Validators } from "@angular/forms";
import isArray from "lodash/isArray";
import { Subject } from "rxjs";
import { takeUntil, tap } from "rxjs/operators";

import { IKpiColorRules } from "../../../../../components/providers/types";
import { DEFAULT_KPI_TILE_COLOR } from "../../../../../constants/default-palette";
import { KpiColorComparatorsRegistryService } from "../../../../../services/kpi-color-comparators-registry.service";
import { ComparatorTypes, IComparatorsDict, IHasChangeDetector, IHasForm, IPaletteColor } from "../../../../../types";

const DEFAULT_LABEL = "Custom Comparator";

@Component({
    selector: "nui-background-color-rules-configuration",
    templateUrl: "./background-color-rules-configuration.component.html",
    styleUrls: ["./background-color-rules-configuration.component.less"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BackgroundColorRulesConfigurationComponent implements IHasChangeDetector, IHasForm, OnChanges, OnInit, OnDestroy {
    public static lateLoadKey = "BackgroundColorRulesConfigurationComponent";

    @Input() rules: IKpiColorRules[];
    @Input() backgroundColors: IPaletteColor[];
    @Output() formReady = new EventEmitter<FormGroup>();

    public form: FormGroup;
    public formLocal: FormGroup;
    public availableComparators: IComparatorsDict;
    public palette: Partial<IPaletteColor[]>;
    public height: number;

    private destroy$ = new Subject();

    constructor(public changeDetector: ChangeDetectorRef,
        private formBuilder: FormBuilder,
        comparatorsRegistry: KpiColorComparatorsRegistryService
    ) {
        this.availableComparators = comparatorsRegistry.getComparators();
    }

    public ngOnInit(): void {
        this.palette = [{ color: DEFAULT_KPI_TILE_COLOR, label: $localize`Default color` }].concat(this.backgroundColors);

        this.formLocal = this.initDefaultRulesGroup();
        this.form = this.formBuilder.group({
            rules: [[]],
        });

        this.formLocal.get("rules")?.value.valueChanges
            .pipe(
                tap((value: IKpiColorRules[]) => this.form.get("rules")?.patchValue([...value])),
                takeUntil(this.destroy$)
            )
            .subscribe();

        this.formReady.emit(this.form);
    }

    public ngOnChanges(changes: SimpleChanges) {
        if (changes.rules) {
            (this.formLocal?.get("rules")?.value as FormArray).setValue([]);

            if (this.rules && isArray(this.rules)) {
                this.rules.forEach(rule => {
                    (this.formLocal.get("rules")?.value as FormArray).push(this.formBuilder.group({
                        comparisonType: [rule.comparisonType, [Validators.required]],
                        value: [rule.value, [Validators.required]],
                        color: [rule.color],
                    }));
                });
            }
        }
    }

    public getColorRulesSubtitle(): string {
        return (this.formLocal?.get("rules")?.value as FormArray).controls.length === 0
            ? $localize`No color rules`
            : $localize`${(this.formLocal?.get("rules")?.value as FormArray).controls.length} color rules`;
    }

    public getLabel(item: ComparatorTypes | string): string {
        return this.availableComparators[item]?.label || DEFAULT_LABEL;
    }

    public removeRule(controlIndex: number) {
        (this.formLocal?.get("rules")?.value as FormArray).removeAt(controlIndex);
    }

    public addRule() {
        (this.formLocal?.get("rules")?.value as FormArray).push(this.formBuilder.group({
            comparisonType: [">", [Validators.required]],
            value: [0, [Validators.required]],
            color: [DEFAULT_KPI_TILE_COLOR],
        }));
    }

    public drop(event: CdkDragDrop<string[]>) {
        this.move(event.currentIndex, event.previousIndex);
    }

    public cdkDragStarted(event: CdkDragStart): void {
        this.height = event.source.element.nativeElement.offsetHeight;
    }

    public ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
    }

    private initDefaultRulesGroup() {
        return this.formBuilder.group({
            rules: [this.formBuilder.array([], Validators.required)],
        });
    }

    private move(currentIndex: number, previousIndex: number): void {
        const rules = this.formLocal?.get("rules")?.value as FormArray;
        const dir = currentIndex > previousIndex ? 1 : -1;
        if (!rules) { return; }

        const temp = rules.at(previousIndex);

        for (let i = previousIndex; i * dir < currentIndex * dir; i = i + dir) {
            const current = rules.at(i + dir);
            rules.setControl(i, current);
        }
        rules.setControl(currentIndex, temp);
    }
}
