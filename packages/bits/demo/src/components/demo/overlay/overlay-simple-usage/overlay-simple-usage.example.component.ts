import { AfterViewInit, Component, ViewChild } from "@angular/core";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";

import { OverlayComponent } from "@nova-ui/bits";

@Component({
    selector: "nui-overlay-simple-usage-example",
    templateUrl: "./overlay-simple-usage.example.component.html",
})
export class OverlaySimpleExampleComponent implements AfterViewInit {
    private destroy$: Subject<any> = new Subject();

    @ViewChild(OverlayComponent) public overlay: OverlayComponent;

    ngAfterViewInit() {
        this.overlay.clickOutside
            .pipe(takeUntil(this.destroy$))
            .subscribe((_) => this.overlay.hide());
    }
}
