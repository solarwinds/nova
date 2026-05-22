import { CommonModule } from "@angular/common";
import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    ElementRef,
    HostListener,
    OnDestroy,
    ViewChild,
    computed,
    inject,
    input,
    output,
    signal,
} from "@angular/core";
import { FormsModule } from "@angular/forms";

import { NuiTextboxModule } from "../textbox/textbox.module";
import { RangeValue } from "./range-filter.models";

@Component({
    selector: "nui-range-filter",
    templateUrl: "./range-filter.component.html",
    styleUrls: ["./range-filter.component.less"],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [CommonModule, FormsModule, NuiTextboxModule],
})
export class RangeFilterComponent implements OnDestroy {
    public readonly min = input<number>(0);
    public readonly max = input<number>(100);
    public readonly valueLow = input<number>(0);
    public readonly valueHigh = input<number>(100);
    public readonly step = input<number>(1);
    public readonly orientation = input<"horizontal" | "vertical">(
        "horizontal"
    );
    public readonly mode = input<"range" | "single">("range");
    public readonly disabled = input<boolean>(false);
    public readonly label = input<string | undefined>(undefined);
    public readonly unit = input<string | undefined>(undefined);
    public readonly showInputs = input<boolean>(true);
    public readonly guides = input<boolean>(false);
    public readonly debounceMs = input<number>(300);

    public readonly rangeChange = output<RangeValue>();

    protected readonly dragHandle = signal<"low" | "high" | null>(null);
    protected readonly displayLow = computed(() => {
        if (this.dragHandle() !== null) {
            return this.liveLow();
        }

        return this.snap(
            Math.max(this.min(), Math.min(this.valueLow(), this.valueHigh()))
        );
    });
    protected readonly displayHigh = computed(() => {
        if (this.dragHandle() !== null) {
            return this.liveHigh();
        }

        return this.snap(
            Math.max(this.valueLow(), Math.min(this.valueHigh(), this.max()))
        );
    });
    protected readonly isDisabled = computed(
        () => this.disabled() || this.min() === this.max()
    );
    protected readonly lowPct = computed(() => this.toPct(this.displayLow()));
    protected readonly highPct = computed(() => this.toPct(this.displayHigh()));
    protected readonly fillStart = computed(() =>
        this.mode() === "single" ? 0 : this.lowPct()
    );
    protected readonly fillSize = computed(
        () => this.highPct() - this.fillStart()
    );
    protected readonly guideDots = computed((): number[] => {
        if (!this.guides()) {
            return [];
        }

        const min = this.min();
        const max = this.max();
        const step = this.step();
        if (step <= 0 || max <= min) {
            return [];
        }

        const count = Math.round((max - min) / step);
        if (count > 100) {
            return [];
        }

        const range = max - min;
        const activeStart = this.fillStart();
        const activeEnd = activeStart + this.fillSize();
        const dots: number[] = [];

        for (let i = 0; i <= count; i++) {
            const pct = ((i * step) / range) * 100;
            if (pct < activeStart || pct > activeEnd) {
                dots.push(pct);
            }
        }

        return dots;
    });

    private readonly liveLow = signal<number>(0);
    private readonly liveHigh = signal<number>(100);
    private readonly cdr = inject(ChangeDetectorRef);
    @ViewChild("trackEl") private readonly trackEl?: ElementRef<HTMLElement>;
    private readonly hostEl = inject(ElementRef<HTMLElement>);

    private debounceTimer?: ReturnType<typeof setTimeout>;
    private dragPointerOffset = 0;

    public ngOnDestroy(): void {
        clearTimeout(this.debounceTimer);
    }

    protected onLowKeydown(event: KeyboardEvent): void {
        if (this.isDisabled() || this.mode() === "single") {
            return;
        }

        const action = this.keyAction(event);
        if (action === null) {
            return;
        }

        event.preventDefault();
        let next: number;
        if (action === "min") {
            next = this.min();
        } else if (action === "max") {
            next = this.displayHigh();
        } else {
            next = this.displayLow() + action;
        }

        next = this.snap(
            Math.max(this.min(), Math.min(next, this.displayHigh()))
        );
        this.emitDebounced({ low: next, high: this.displayHigh() });
    }

    protected onHighKeydown(event: KeyboardEvent): void {
        if (this.isDisabled()) {
            return;
        }

        const action = this.keyAction(event);
        if (action === null) {
            return;
        }

        event.preventDefault();
        const floor = this.mode() === "single" ? this.min() : this.displayLow();
        let next: number;
        if (action === "min") {
            next = floor;
        } else if (action === "max") {
            next = this.max();
        } else {
            next = this.displayHigh() + action;
        }

        next = this.snap(Math.max(floor, Math.min(next, this.max())));
        this.emitDebounced({
            low: this.mode() === "single" ? this.min() : this.displayLow(),
            high: next,
        });
    }

    protected onHandleMousedown(
        event: MouseEvent,
        handle: "low" | "high"
    ): void {
        if (this.isDisabled()) {
            return;
        }

        event.preventDefault();
        (event.currentTarget as HTMLElement).focus();

        const currentLow = this.displayLow();
        const currentHigh = this.displayHigh();
        this.liveLow.set(currentLow);
        this.liveHigh.set(currentHigh);
        this.dragHandle.set(handle);

        const track = this.trackEl?.nativeElement;
        if (!track) {
            this.dragPointerOffset = 0;
            return;
        }

        const rect = track.getBoundingClientRect();
        const handlePct =
            this.toPct(handle === "low" ? currentLow : currentHigh) / 100;
        this.dragPointerOffset =
            this.orientation() === "horizontal"
                ? event.clientX - (rect.left + handlePct * rect.width)
                : event.clientY - (rect.bottom - handlePct * rect.height);
    }

    @HostListener("document:mousemove", ["$event"])
    protected onDocumentMousemove(event: MouseEvent): void {
        if (this.dragHandle() === null) {
            return;
        }

        const value = this.eventToValue(event, this.dragPointerOffset);
        if (this.dragHandle() === "low") {
            this.liveLow.set(
                this.snap(
                    Math.max(this.min(), Math.min(value, this.liveHigh()))
                )
            );
        } else {
            const floor =
                this.mode() === "single" ? this.min() : this.liveLow();
            this.liveHigh.set(
                this.snap(Math.max(floor, Math.min(value, this.max())))
            );
        }

        this.cdr.markForCheck();
    }

    @HostListener("document:mouseup")
    protected onDocumentMouseup(): void {
        if (this.dragHandle() === null) {
            return;
        }

        const low = this.mode() === "single" ? this.min() : this.liveLow();
        const high = this.liveHigh();
        this.dragHandle.set(null);
        clearTimeout(this.debounceTimer);
        this.rangeChange.emit({ low, high });
        this.cdr.markForCheck();
    }

    protected onTrackClick(event: MouseEvent): void {
        if (this.isDisabled()) {
            return;
        }

        const value = this.eventToValue(event);
        const distHigh = Math.abs(value - this.displayHigh());
        const distLow = Math.abs(value - this.displayLow());
        if (this.mode() === "single" || distHigh <= distLow) {
            const floor =
                this.mode() === "single" ? this.min() : this.displayLow();
            const next = this.snap(
                Math.max(floor, Math.min(value, this.max()))
            );
            this.emitDebounced({
                low: this.mode() === "single" ? this.min() : this.displayLow(),
                high: next,
            });
            return;
        }

        const next = this.snap(
            Math.max(this.min(), Math.min(value, this.displayHigh()))
        );
        this.emitDebounced({ low: next, high: this.displayHigh() });
    }

    protected onLowInputChange(rawValue: string): void {
        if (this.isDisabled()) {
            return;
        }

        const next = this.clampAndSnap(
            rawValue,
            this.min(),
            this.displayHigh()
        );
        this.emitDebounced({ low: next, high: this.displayHigh() });
    }

    protected onHighInputChange(rawValue: string): void {
        if (this.isDisabled()) {
            return;
        }

        const floor = this.mode() === "single" ? this.min() : this.displayLow();
        const next = this.clampAndSnap(rawValue, floor, this.max());
        this.emitDebounced({
            low: this.mode() === "single" ? this.min() : this.displayLow(),
            high: next,
        });
    }

    private keyAction(event: KeyboardEvent): number | "min" | "max" | null {
        const isHorizontal = this.orientation() === "horizontal";
        const incrementKey = isHorizontal ? "ArrowRight" : "ArrowUp";
        const decrementKey = isHorizontal ? "ArrowLeft" : "ArrowDown";
        const largeStep = this.step() * 10;

        if (event.key === incrementKey) {
            return event.shiftKey ? largeStep : this.step();
        }
        if (event.key === decrementKey) {
            return event.shiftKey ? -largeStep : -this.step();
        }
        if (event.key === "Home") {
            return "min";
        }
        if (event.key === "End") {
            return "max";
        }

        return null;
    }

    private eventToValue(event: MouseEvent, pointerOffset = 0): number {
        const track = this.trackEl?.nativeElement;
        if (!track) {
            return this.min();
        }

        const rect = track.getBoundingClientRect();
        const pct =
            this.orientation() === "horizontal"
                ? Math.max(
                      0,
                      Math.min(
                          1,
                          (event.clientX - pointerOffset - rect.left) /
                              rect.width
                      )
                  )
                : Math.max(
                      0,
                      Math.min(
                          1,
                          1 -
                              (event.clientY - pointerOffset - rect.top) /
                                  rect.height
                      )
                  );

        return this.min() + pct * (this.max() - this.min());
    }

    private toPct(value: number): number {
        const range = this.max() - this.min();

        return range === 0 ? 0 : ((value - this.min()) / range) * 100;
    }

    private snap(value: number): number {
        const step = this.step();

        return step > 0 ? Math.round(value / step) * step : value;
    }

    private clampAndSnap(rawValue: string, low: number, high: number): number {
        const parsed = parseFloat(rawValue);
        return this.snap(
            Math.max(low, Math.min(Number.isNaN(parsed) ? low : parsed, high))
        );
    }

    private emitDebounced(value: RangeValue): void {
        clearTimeout(this.debounceTimer);
        const debounceMs = this.debounceMs();
        if (debounceMs <= 0) {
            this.rangeChange.emit(value);
            return;
        }

        this.debounceTimer = setTimeout(() => {
            this.rangeChange.emit(value);
        }, debounceMs);
    }
}
