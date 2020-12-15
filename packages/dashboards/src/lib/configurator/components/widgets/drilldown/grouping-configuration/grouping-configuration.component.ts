import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    EventEmitter,
    Input,
    OnChanges,
    OnInit,
    Output,
    SimpleChanges
} from "@angular/core";
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import _difference from "lodash/difference";

import { IHasChangeDetector, IHasForm } from "../../../../../types";


@Component({
    selector: "nui-grouping-configuration",
    templateUrl: "./grouping-configuration.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush,
    styles: [`
        .grouping-configuration__accordion-content {
            padding: 15px 15px 15px 46px;
        }
    `],
})
// Remember to declare this class in the parent module
export class GroupingConfigurationComponent implements OnInit, OnChanges, IHasChangeDetector, IHasForm {

    public static lateLoadKey = "DrilldownConfiguratorComponent";

    @Input() groups: string[];
    @Input() groupBy: string[];
    @Output() formReady = new EventEmitter<FormGroup>();

    public form: FormGroup = this.formBuilder.group({
        groupBy: this.formBuilder.array([]),
    });

    public selectData: Array<Array<string>>;

    constructor(public changeDetector: ChangeDetectorRef, private formBuilder: FormBuilder) { }

    public get getGroupByControl(): FormArray {
        return this.form.get("groupBy") as FormArray;
    }

    public ngOnInit(): void {
        this.getGroupByControl.valueChanges.subscribe(() => this.fillGroupsOptions());
        this.fillGroupsOptions();

        this.formReady.emit(this.form);
    }

    public ngOnChanges(changes: SimpleChanges): void {
        if (changes.groupBy && !changes.groupBy.firstChange) {
            this.getGroupByControl.clear();
            this.groupBy.forEach(group => this.getGroupByControl.push(this.createControl(group)));
            this.fillGroupsOptions();
        }
    }

    public createControl(value?: string): FormControl {
        return this.formBuilder.control(value || "", Validators.required);
    }

    public addGrouping(): void {
        const control = this.createControl();
        this.getGroupByControl.push(control);
        this.fillGroupsOptions();
        const lastControlIndex = this.getGroupByControl.controls.length - 1;
        control.setValue(this.selectData[lastControlIndex][0]);
    }

    public removeRule(index: number): void {
        this.getGroupByControl.removeAt(index);
        this.fillGroupsOptions();
    }

    public isAddRestricted() {
        return this.selectData.some(i => i.length === 1);
    }

    public getSubtitle(): string {
        const subtitle = this.getGroupByControl.controls.map((control: AbstractControl, index: number) =>
            `${index === 0 ? "By" : "then"} ${control.value}`).join(", ");

        return this.getGroupByControl?.value.length === 0
            ? $localize`No groups`
            : $localize`${subtitle}`;
    }

    private fillGroupsOptions() {
        this.selectData = [];
        const controlValue = this.getGroupByControl.value as string[];
        this.getGroupByControl.controls.forEach((value: AbstractControl, index: number) => {
            this.selectData[index] = [];
            const diff = _difference(this.groups, controlValue);
            if (controlValue[index]) {
                this.selectData[index].push(controlValue[index]);
            }
            this.selectData[index] = [...this.selectData[index], ...diff];
        });
    }
}
