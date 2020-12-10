import { OverlayConfig } from "@angular/cdk/overlay";
import { AfterViewInit, Component, OnDestroy, ViewChild, ViewEncapsulation } from "@angular/core";
import { OVERLAY_WITH_POPUP_STYLES_CLASS, OverlayComponent } from "@nova-ui/bits";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";


@Component({
    selector: "nui-overlay-viewport-margin-example",
    templateUrl: "./overlay-viewport-margin.example.component.html",
    encapsulation: ViewEncapsulation.Emulated,
})
export class OverlayViewportMarginExampleComponent implements AfterViewInit, OnDestroy {
    public viewportMargin: number;
    public items = Array.from({ length : 50 }).map((_, i) => `Item ${i}`);
    public overlayConfig: OverlayConfig = {
        panelClass: OVERLAY_WITH_POPUP_STYLES_CLASS,
    };

    private destroy$: Subject<any> = new Subject();

    @ViewChild(OverlayComponent) public overlay: OverlayComponent;

    public ngAfterViewInit() {
        this.overlay.clickOutside
            .pipe(takeUntil(this.destroy$))
            .subscribe(_ => this.overlay.hide());
    }

    public setViewportMargin(margin: number) {
        this.viewportMargin = margin;
    }

    public ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
