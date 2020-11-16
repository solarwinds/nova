import { AfterViewInit, Component, ViewChild } from "@angular/core";
import { OverlayComponent } from "@solarwinds/nova-bits";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";


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
            .subscribe(_ => this.overlay.hide());
    }
}
