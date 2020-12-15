import { OverlayConfig } from "@angular/cdk/overlay";
import { AfterViewInit, Component, OnDestroy, ViewChild } from "@angular/core";
import { OVERLAY_WITH_POPUP_STYLES_CLASS, OverlayComponent } from "@nova-ui/bits";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";


@Component({
    selector: "nui-overlay-popup-styles-example",
    templateUrl: "./overlay-popup-styles.example.component.html",
})
export class OverlayPopupStylesExampleComponent implements AfterViewInit, OnDestroy {

    private destroy$: Subject<any> = new Subject();

    public overlayConfig: OverlayConfig = {
        panelClass: [OVERLAY_WITH_POPUP_STYLES_CLASS],
    };

    @ViewChild("overlayWithStyles") public overlayWithStyles: OverlayComponent;
    @ViewChild("overlayNoStyles") public overlayNoStyles: OverlayComponent;

    ngAfterViewInit() {
        this.overlayWithStyles.clickOutside
            .pipe(takeUntil(this.destroy$))
            .subscribe(_ => this.overlayWithStyles.hide());

        this.overlayNoStyles.clickOutside
            .pipe(takeUntil(this.destroy$))
            .subscribe(_ => this.overlayNoStyles.hide());
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
