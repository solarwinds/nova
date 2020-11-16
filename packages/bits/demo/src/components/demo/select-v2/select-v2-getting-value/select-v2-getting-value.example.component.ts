import { AfterViewInit, Component, ViewChild } from "@angular/core";
import { SelectV2Component } from "@solarwinds/nova-bits";
import { Subject } from "rxjs";
import { takeUntil, tap } from "rxjs/operators";

@Component({
    selector: "nui-select-v2-getting-value-example",
    templateUrl: "select-v2-getting-value.example.component.html",
    host: { class: "select-container" },
})
export class SelectV2GettingValueExampleComponent implements AfterViewInit {
    public items = Array.from({ length : 50 }).map((_, i) => $localize `Item ${i}`);
    public selectValueSelectedValue: string;

    @ViewChild("selectValueSelectedExample") private selectValueSelectedExample: SelectV2Component;
    private destroy$: Subject<any> = new Subject<any>();

    ngAfterViewInit(): void {
        this.selectValueSelectedExample.valueSelected.pipe(
            tap(value => this.selectValueSelectedValue = value as string),
            takeUntil(this.destroy$)
        ).subscribe();
    }
}
