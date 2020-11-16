import {
    Component,
    ElementRef,
    EventEmitter,
    forwardRef,
    Input,
    NgZone,
    OnDestroy,
    OnInit,
    Output,
    ViewChild,
    ViewEncapsulation
} from "@angular/core";
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from "@angular/forms";
import _isEmpty from "lodash/isEmpty";
import _isNil from "lodash/isNil";
import moment from "moment/moment";
import { Moment } from "moment/moment";
import { Subject } from "rxjs";
import { debounceTime, take } from "rxjs/operators";

import { NuiFormFieldControl } from "../form-field/public-api";
import { IMenuGroup, IMenuItem } from "../menu/public-api";
import { PopupComponent } from "../popup-adapter/popup-adapter.component";
import { TextboxComponent } from "../textbox/textbox.component";

// <example-url>./../examples/index.html#/time-picker</example-url><br />

@Component({
    selector: "nui-time-picker",
    templateUrl: "./time-picker.component.html",
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => TimePickerComponent),
            multi: true,
        },
        {
            provide: NuiFormFieldControl,
            useExisting: forwardRef(() => TimePickerComponent),
            multi: true,
        },
    ],
    styleUrls: ["./time-picker.component.less"],
    encapsulation: ViewEncapsulation.None,
})
export class TimePickerComponent implements OnInit, OnDestroy, ControlValueAccessor, NuiFormFieldControl {

    @ViewChild("date", {static: true}) textbox: TextboxComponent;
    @ViewChild(PopupComponent, {static: true}) popup: PopupComponent;
    /** sets a step (difference between item in picker) */
    @Input() timeStep =  30;
    /** sets disable state of the timepicker */
    @Input() isDisabled: boolean;
    /** sets custom formatting for time */
    @Input() timeFormat = "LT";
    /** tells timepicker whether to save year, month, day and seconds of the date*/
    @Input() preserveInsignificant = false;
    /** to apply error state styles */
    @Input() isInErrorState = false;
    /** Input to set aria label text */
    @Input() public ariaLabel: string = "";
    /** to allow the empty values for init state */
    @Input() initEmpty: boolean;
    /** Allows popup box to be attached to document.body */
    @Input() appendToBody: boolean;

    @Input()
    get model(): Moment | undefined {
        return this.innerModel;
    }

    set model(value: Moment | undefined) {
        if (!moment(value).isValid()) {
            return;
        }

        if (value && !this.preserveInsignificant) {
            value.year(0).month(0).date(0);
        }
        this.innerModel = value;
        this.textbox.writeValue(moment(this.innerModel).format(this.timeFormat));
    }

    @Output() public timeChanged = new EventEmitter();

    @Output() inputBlurred: EventEmitter<any> = new EventEmitter<Moment>();

    public times: Moment[];
    public itemsSource: IMenuGroup[] = [{
        itemsSource: [],
    }];
    public innerModel?: Moment;
    private itemToSelect: any;
    private inputChanged: Subject<string> = new Subject<string>();

    constructor(private elementRef: ElementRef,
                private ngZone: NgZone) {}

    ngOnInit() {
        this.times = this.generateTimeItems(this.timeStep);
        this.times.map((value: Moment) => {
            this.itemsSource[0].itemsSource.push({title: value, displayFormat: this.timeFormat, isSelected: false});
        });
        if (!this.initEmpty) {
            this.innerModel = moment(this.model).clone() || moment();
            this.textbox.writeValue(moment(this.innerModel).format(this.timeFormat));
        }

        this.itemToSelect = this.getItemToSelect();
        this.inputChanged
            .pipe(debounceTime(500))
            .subscribe(value => {
                this.updateInnerModel(value);
                this.itemToSelect = this.getItemToSelect();
                this.timeChanged.emit(this.innerModel);
                this.onChange(this.innerModel);
                this.setErrorState(value);
            });
    }

    onChange(value: any) {}

    onTouched() {}

    updateInnerModel(value: any) {
        setTimeout(() => this.inputBlurred.emit(), 100);
        if (value instanceof moment && !this.preserveInsignificant) {
            (value as Moment).year(0);
            (value as Moment).date(1);
            (value as Moment).month(0);
            (value as Moment).seconds(0);
        }
        this.innerModel = _isEmpty(value) || value.length === 0 ? undefined : moment(value, this.timeFormat);
        if (!moment(this.innerModel).isValid()) {
            this.innerModel = value;
        }
        this.onTouched();
        if (!_isEmpty(this.times) && !_isEmpty(this.innerModel) && !_isNil(this.innerModel)) {
            const index = this.getItemIndexToSelect(this.innerModel, this.timeStep, this.times);
            this.unselectAllItems();
            if (isFinite(index)) {
                this.itemsSource[0].itemsSource[index].isSelected = true;
                this.itemToSelect = this.itemsSource[0].itemsSource[index];
            }
        }
        this.setErrorState(value);
    }

    writeValue(value: any) {
        this.textbox.writeValue(this.formatValue(value));
        this.updateInnerModel(this.formatValue(value));
    }

    setErrorState(value: string) {
        this.isInErrorState = !moment(value, this.timeFormat, true).isValid();
    }

    registerOnChange(fn: (value: any) => {}) {
        this.onChange = fn;
    }

    registerOnTouched(fn: () => {}) {
        this.onTouched = fn;
    }
    setDisabledState(isDisabled: boolean): void {
        this.isDisabled = isDisabled;
    }

    focusOnForm() {
        this.textbox.focus();
    }

    public onInputActiveDateChanged(value: string): void {
        this.inputChanged.next(value);
    }

    public select(time: IMenuItem) {
        this.updateInnerModel(time.title);
        this.textbox.writeValue(this.formatValue() as string);
        this.timeChanged.emit(this.innerModel);
        this.onChange(this.innerModel);
    }

    public scrollToView(event: any) {
        const selectedItem = this.elementRef
            .nativeElement
            .getElementsByClassName("nui-menu-item--selected")[0];
        this.ngZone.onStable.asObservable().pipe(take(1))
            .subscribe(() => {
                // to scroll to selected item on timepicker opening.
                this.ngZone.run(() => {
                    if (event && selectedItem) {
                        const menuElement = this.elementRef
                            .nativeElement
                            .getElementsByClassName("nui-timepicker__menu")[0];
                        const topPos = this.elementRef
                            .nativeElement
                            .getElementsByClassName("nui-menu-item--selected")[0]
                            .offsetTop;
                        const height = menuElement.offsetHeight;
                        menuElement.scrollTop = topPos - height / 2;
                    }
                });
            });
    }

    public generateTimeItems(timeStep: number): Moment[] {
        const time = this.preserveInsignificant ? moment().hour(0).startOf("hour") : moment().year(0).startOf("year");

        const initialDay = time.dayOfYear();
        const times: Moment[] = [];
        while (time.dayOfYear() === initialDay) {
            times.push(time.clone());
            time.add(timeStep, "minute");
        }
        return times;
    }

    public isItemSelected(timeItem: Moment) {
        return moment(timeItem).isSame(this.itemToSelect.title);
    }

    public getItemIndexToSelect(model: Moment | string, timeStep: number, times: Moment[]): number {
        const time = moment(model);
        const minutes = time.get("hours") * 60 + time.get("minutes");
        const index = Math.round(minutes / timeStep);
        return index === times.length ? 0 : index;
    }

    public getItemToSelect() {
        if (_isEmpty(this.innerModel) || _isNil(this.innerModel)) {
            this.unselectAllItems();
            return;
        }

        const index = this.getItemIndexToSelect(this.innerModel, this.timeStep, this.times);
        this.unselectAllItems();
        if (isFinite(index)) {
            this.itemsSource[0].itemsSource[index].isSelected = true;
            return this.itemsSource[0].itemsSource[index];
        }
    }

    public unselectAllItems() {
        this.itemsSource[0].itemsSource.forEach((el: IMenuItem) => el.isSelected = false);
    }

    public formatValue(value: any = this.innerModel) {
        return moment(value).isValid() ? moment(value).format(this.timeFormat) : value;
    }

    public getIconColor(): string {
        return this.isDisabled ? "gray" : "primary-blue";
    }

    ngOnDestroy() {
        this.inputChanged.unsubscribe();
    }
}
