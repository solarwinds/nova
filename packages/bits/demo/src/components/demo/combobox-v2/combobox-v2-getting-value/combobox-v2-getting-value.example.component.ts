import { AfterViewInit, Component, ViewChild } from "@angular/core";
import { ComboboxV2Component } from "@solarwinds/nova-bits";
import { Subject } from "rxjs";
import { takeUntil, tap } from "rxjs/operators";

@Component({
    selector: "nui-combobox-v2-getting-value-example",
    templateUrl: "combobox-v2-getting-value.example.component.html",
    host: { class: "combobox-container" },
})
export class ComboboxV2GettingValueExampleComponent implements AfterViewInit {
    public items = Array.from({ length : 50 }).map((_, i) => $localize `Item ${i}`);
    public comboboxValueSelectedValue: string;
    public comboboxValueChangedValue: string;

    @ViewChild("comboboxValueSelectedExample") private comboboxValueSelectedExample: ComboboxV2Component;
    @ViewChild("comboboxValueChangedExample") private comboboxValueChangedExample: ComboboxV2Component;
    private destroy$: Subject<any> = new Subject<any>();

    ngAfterViewInit(): void {
        this.comboboxValueSelectedExample.valueSelected.pipe(
            tap(value => this.comboboxValueSelectedValue = value as string),
            takeUntil(this.destroy$)
        ).subscribe();

        this.comboboxValueChangedExample.valueChanged.pipe(
            tap(value => this.comboboxValueChangedValue = value as string),
            takeUntil(this.destroy$)
        ).subscribe();
    }
}
