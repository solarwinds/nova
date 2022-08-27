import { CdkVirtualScrollViewport } from "@angular/cdk/scrolling";
import {
    AfterViewInit,
    Component,
    HostListener,
    OnDestroy,
    ViewChild,
} from "@angular/core";
import { FormControl } from "@angular/forms";
import { Observable, of, Subject } from "rxjs";
import { delay, filter, takeUntil, tap } from "rxjs/operators";

import { ComboboxV2Component } from "@nova-ui/bits";

const defaultContainerHeight: number = 300;

@Component({
    selector: "nui-combobox-v2-virtual-scroll-example",
    templateUrl: "combobox-v2-virtual-scroll.example.component.html",
    host: { class: "combobox-container" },
})
export class ComboboxV2VirtualScrollExampleComponent
    implements OnDestroy, AfterViewInit
{
    public items = Array.from({ length: 100000 }).map(
        (_, i) => $localize`Item ${i}`
    );
    public comboboxControl = new FormControl();
    public filteredItems: Observable<any[]> = of([...this.items]);
    public containerHeight: number = defaultContainerHeight;

    private destroy$: Subject<void> = new Subject();
    private scrollOffset: number = 0;

    @ViewChild(CdkVirtualScrollViewport)
    private viewport: CdkVirtualScrollViewport;
    @ViewChild(ComboboxV2Component) private combobox: ComboboxV2Component;

    @HostListener("click")
    public handleClick() {
        if (this.viewport) {
            this.viewport.scrollToOffset(this.scrollOffset);
        }
    }

    ngAfterViewInit(): void {
        this.combobox.valueSelected
            .pipe(takeUntil(this.destroy$))
            .subscribe(() => {
                this.scrollOffset = this.viewport.measureScrollOffset();
            });

        this.combobox.valueChanged
            .pipe(
                filter((v) => v !== undefined),
                tap(
                    (v) =>
                        (this.filteredItems = of(this.filterItems(v as string)))
                ),
                delay(0),
                tap(this.calculateContainerHeight),
                takeUntil(this.destroy$)
            )
            .subscribe();
    }

    private filterItems(value: string): string[] {
        if (!value) {
            return this.items;
        }
        const filterValue = value?.toLowerCase();

        return this.items.filter((option) =>
            option.toLowerCase().includes(filterValue)
        );
    }

    private calculateContainerHeight = (): void => {
        if (
            this.combobox.inputValue &&
            this.viewport.measureRenderedContentSize() < defaultContainerHeight
        ) {
            this.containerHeight = this.viewport.measureRenderedContentSize();
            return;
        }
        this.containerHeight = defaultContainerHeight;
    };

    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
