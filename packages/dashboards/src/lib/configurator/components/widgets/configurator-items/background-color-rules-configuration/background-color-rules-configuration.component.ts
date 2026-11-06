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

import { CdkDragDrop, CdkDragStart } from "@angular/cdk/drag-drop";
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
import { FormArray, FormBuilder, FormGroup, Validators } from "@angular/forms";
import isArray from "lodash/isArray";
import { Subject } from "rxjs";
import { takeUntil, tap } from "rxjs/operators";

import { IKpiColorRules } from "../../../../../components/providers/types";
import { DEFAULT_KPI_TILE_COLOR } from "../../../../../constants/default-palette";
import { KpiColorComparatorsRegistryService } from "../../../../../services/kpi-color-comparators-registry.service";
import {
    ComparatorTypes,
    IComparatorsDict,
    IHasChangeDetector,
    IHasForm,
    IPaletteColor,
} from "../../../../../types";
import { KeyboardReorder } from "../../../../keyboard-reorder";

const DEFAULT_LABEL = "Custom Comparator";

@Component({
    selector: "nui-background-color-rules-configuration",
    templateUrl: "./background-color-rules-configuration.component.html",
    styleUrls: ["./background-color-rules-configuration.component.less"],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false,
})
export class BackgroundColorRulesConfigurationComponent
    implements IHasChangeDetector, IHasForm, OnChanges, OnInit, OnDestroy
{
    public static lateLoadKey = "BackgroundColorRulesConfigurationComponent";
    private static reorderInstructionsCounter = 0;

    @Input() rules: IKpiColorRules[];
    @Input() backgroundColors: IPaletteColor[];
    @Output() formReady = new EventEmitter<FormGroup>();

    public form: FormGroup;
    public formLocal: FormGroup;
    public availableComparators: IComparatorsDict;
    public palette: Partial<IPaletteColor[]>;
    public height: number;
    public readonly reorderInstructionsId = `nui-background-color-rules-reorder-instructions-${BackgroundColorRulesConfigurationComponent.reorderInstructionsCounter++}`;
    private readonly destroy$ = new Subject<void>();
    public readonly reorder = new KeyboardReorder<FormGroup>(
        () =>
            (this.formLocal?.get("rules")?.value as FormArray<FormGroup>)
                ?.controls ?? [],
        (from, to) => {
            this.move(to, from, true);
            this.changeDetector.detectChanges();
        },
        rule => rule.disabled,
        () => this.changeDetector.markForCheck()
    );

    constructor(
        public changeDetector: ChangeDetectorRef,
        private formBuilder: FormBuilder,
        comparatorsRegistry: KpiColorComparatorsRegistryService
    ) {
        this.availableComparators = comparatorsRegistry.getComparators();
    }

    public ngOnInit(): void {
        this.palette = [
            { color: DEFAULT_KPI_TILE_COLOR, label: $localize`Default color` },
        ].concat(this.backgroundColors);

        this.formLocal = this.initDefaultRulesGroup();
        this.form = this.formBuilder.group({
            rules: [[]],
        });

        this.formLocal
            .get("rules")
            ?.value.valueChanges.pipe(
                tap((value: IKpiColorRules[]) =>
                    this.form.get("rules")?.patchValue([...value])
                ),
                takeUntil(this.destroy$)
            )
            .subscribe();

        this.formReady.emit(this.form);
    }

    public ngOnChanges(changes: SimpleChanges): void {
        if (changes.rules) {
            (this.formLocal?.get("rules")?.value as FormArray).setValue([]);

            if (this.rules && isArray(this.rules)) {
                this.rules.forEach(rule => {
                    (this.formLocal.get("rules")?.value as FormArray).push(
                        this.formBuilder.group({
                            comparisonType: [
                                rule.comparisonType,
                                [Validators.required],
                            ],
                            value: [rule.value, [Validators.required]],
                            color: [rule.color],
                        })
                    );
                });
            }
        }
    }

    public getColorRulesSubtitle(): string {
        return (this.formLocal?.get("rules")?.value as FormArray).controls
            .length === 0
            ? $localize`No color rules`
            : $localize`${
                  (this.formLocal?.get("rules")?.value as FormArray).controls
                      .length
              } color rules`;
    }

    public getLabel(item: ComparatorTypes | string): string {
        return this.availableComparators[item]?.label || DEFAULT_LABEL;
    }

    public removeRule(controlIndex: number): void {
        this.reorder.cancel();
        (this.formLocal?.get("rules")?.value as FormArray).removeAt(
            controlIndex
        );
    }

    public addRule(): void {
        (this.formLocal?.get("rules")?.value as FormArray).push(
            this.formBuilder.group({
                comparisonType: [">", [Validators.required]],
                value: [0, [Validators.required]],
                color: [DEFAULT_KPI_TILE_COLOR],
            })
        );
    }

    public drop(event: CdkDragDrop<string[]>): void {
        this.move(event.currentIndex, event.previousIndex);
    }

    public cdkDragStarted(event: CdkDragStart): void {
        this.reorder.finish();
        this.height = event.source.element.nativeElement.offsetHeight;
    }

    public ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    private initDefaultRulesGroup() {
        return this.formBuilder.group({
            rules: [this.formBuilder.array([], Validators.required)],
        });
    }

    private move(
        currentIndex: number,
        previousIndex: number,
        batchChanges = false
    ): void {
        const rules = this.formLocal?.get("rules")?.value as FormArray;
        const dir = currentIndex > previousIndex ? 1 : -1;
        if (!rules) {
            return;
        }

        const temp = rules.at(previousIndex);

        for (let i = previousIndex; i * dir < currentIndex * dir; i = i + dir) {
            const current = rules.at(i + dir);
            rules.setControl(i, current, { emitEvent: !batchChanges });
        }
        rules.setControl(currentIndex, temp, { emitEvent: !batchChanges });
        if (batchChanges) {
            // Intermediate duplicates can destroy the focused rule's view.
            rules.updateValueAndValidity();
        }
    }
}
