import { CdkVirtualScrollViewport } from "@angular/cdk/scrolling";
import { AfterViewInit, Component, HostListener, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { FormControl } from "@angular/forms";
import { SelectV2Component } from "@nova-ui/bits";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";

@Component({
    selector: "nui-select-v2-virtual-scroll-example",
    templateUrl: "select-v2-virtual-scroll.example.component.html",
    host: { class: "select-container" },
})
export class SelectV2VirtualScrollExampleComponent implements OnInit, OnDestroy, AfterViewInit {
    public icons: any[] = ["check", "email", "execute"];
    public items = Array.from({ length: 100000 }).map((_, i) => $localize `Item ${i}`);

    public selectControl = new FormControl();
    public containerHeight: number = 300;

    private destroy$: Subject<void> = new Subject();
    private scrollOffset: number = 0;

    @ViewChild(CdkVirtualScrollViewport) private viewport: CdkVirtualScrollViewport;
    @ViewChild(SelectV2Component) private select: SelectV2Component;

    @HostListener("click", ["$event"])
    public handleClick(event: MouseEvent) {
        if (this.viewport) {
            this.viewport.scrollToOffset(this.scrollOffset);
            this.viewport.checkViewportSize();
        }
    }

    ngOnInit() {
        this.selectControl.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(value => {
            console.log("Value from Select", value);
        });
    }

    ngAfterViewInit(): void {
        this.select.valueSelected.pipe(takeUntil(this.destroy$)).subscribe((selectionText) => {
            this.scrollOffset = this.viewport.measureScrollOffset();
        });
    }

    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
