import {
    AfterViewInit,
    ChangeDetectionStrategy,
    Component,
    ViewChild,
} from "@angular/core";
import { Subject } from "rxjs";
import { takeUntil, tap } from "rxjs/operators";

import { TextboxComponent } from "@nova-ui/bits";

@Component({
    selector: "nui-textbox-getting-value-example",
    templateUrl: "./textbox-getting-value.example.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TextboxGettingValueExampleComponent implements AfterViewInit {
    public textboxValueChangedValue: string | number;
    private destroy$: Subject<any> = new Subject<any>();

    @ViewChild("textboxValueChangedExample") textbox: TextboxComponent;

    ngAfterViewInit() {
        this.textbox.textChange
            .pipe(
                tap(
                    (value) => (this.textboxValueChangedValue = value as string)
                ),
                takeUntil(this.destroy$)
            )
            .subscribe();
    }
}
