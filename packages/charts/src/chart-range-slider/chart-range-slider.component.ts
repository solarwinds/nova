import {
    ChangeDetectionStrategy,
    Component,
    ElementRef,
    EventEmitter,
    HostListener,
    Input,
    OnChanges,
    Output,
    SimpleChanges,
    ViewChild,
} from "@angular/core";

import { IChartRangeSliderRange, IChartRangeSliderSeries } from "./types";

interface IRenderedChartRangeSliderSeries {
    id: string;
    color: string;
    areaPath: string;
    linePath: string;
}

interface IYDomain {
    min: number;
    max: number;
    baseline: number;
}

@Component({
    selector: "nui-chart-range-slider",
    templateUrl: "./chart-range-slider.component.html",
    styleUrls: ["./chart-range-slider.component.less"],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false,
})
export class ChartRangeSliderComponent implements OnChanges {
    @Input() public series: IChartRangeSliderSeries[] = [];
    @Input() public visibleRange = 0;
    @Input() public selectedIndex = 0;
    @Input() public height = 24;
    @Input() public trackOffset = 0;

    @Output() public selectedIndexChange = new EventEmitter<number>();
    @Output() public rangeChange = new EventEmitter<IChartRangeSliderRange>();

    @ViewChild("track", { static: true })
    public track: ElementRef<SVGSVGElement>;

    public readonly viewBoxWidth = 100;
    public previewSeries: IRenderedChartRangeSliderSeries[] = [];
    public selectionRect = { x: 0, width: 0 };
    public selectionRange: IChartRangeSliderRange = this.createEmptyRange();

    private isDragging = false;
    private dragOffset = 0;
    private totalPointCount = 0;

    public ngOnChanges(changes: SimpleChanges): void {
        if (
            changes["series"] ||
            changes["visibleRange"] ||
            changes["selectedIndex"] ||
            changes["height"]
        ) {
            this.rebuildView();
        }
    }

    public onTrackMouseDown(event: MouseEvent): void {
        if (!this.canInteract()) {
            return;
        }

        this.applySelectionFromPointer(
            this.getPointerPosition(event) - this.selectionRect.width / 2
        );
    }

    public onSelectionMouseDown(event: MouseEvent): void {
        if (!this.canInteract()) {
            return;
        }

        event.preventDefault();
        event.stopPropagation();
        this.isDragging = true;
        this.dragOffset = this.getPointerPosition(event) - this.selectionRect.x;
    }

    @HostListener("document:mousemove", ["$event"])
    public onDocumentMouseMove(event: MouseEvent): void {
        if (!this.isDragging) {
            return;
        }

        event.preventDefault();
        this.applySelectionFromPointer(
            this.getPointerPosition(event) - this.dragOffset
        );
    }

    @HostListener("document:mouseup")
    public onDocumentMouseUp(): void {
        this.isDragging = false;
    }

    private rebuildView(): void {
        const activeSeries = this.getActiveSeries();
        const referenceSeries = this.getReferenceSeries(activeSeries);

        this.totalPointCount = this.getTotalPointCount(activeSeries);
        this.previewSeries = this.buildPreviewSeries(activeSeries);
        this.setSelection(this.selectedIndex, referenceSeries);
    }

    private setSelection(
        nextIndex: number,
        referenceSeries: IChartRangeSliderSeries | undefined,
        emit = false
    ): void {
        const clampedIndex = this.getClampedSelectionIndex(nextIndex);

        this.selectedIndex = clampedIndex;
        this.selectionRect = this.buildSelectionRect(clampedIndex);
        this.selectionRange = this.buildRange(clampedIndex, referenceSeries);

        if (emit) {
            this.selectedIndexChange.emit(this.selectionRange.startIndex);
            this.rangeChange.emit(this.selectionRange);
        }
    }

    private applySelectionFromPointer(pointerX: number): void {
        const trackLimit = Math.max(
            this.viewBoxWidth - this.selectionRect.width,
            0
        );
        const clampedPointer = this.clamp(pointerX, 0, trackLimit);
        const nextIndex =
            (clampedPointer / this.viewBoxWidth) * this.totalPointCount;

        this.setSelection(
            nextIndex,
            this.getReferenceSeries(this.getActiveSeries()),
            true
        );
    }

    private buildSelectionRect(startIndex: number): {
        x: number;
        width: number;
    } {
        const effectiveVisibleRange = this.getEffectiveVisibleRange();

        if (!this.totalPointCount || !effectiveVisibleRange) {
            return { x: 0, width: 0 };
        }

        if (effectiveVisibleRange >= this.totalPointCount) {
            return { x: 0, width: this.viewBoxWidth };
        }

        return {
            width:
                (effectiveVisibleRange / this.totalPointCount) *
                this.viewBoxWidth,
            x: (startIndex / this.totalPointCount) * this.viewBoxWidth,
        };
    }

    private buildRange(
        startIndex: number,
        referenceSeries: IChartRangeSliderSeries | undefined
    ): IChartRangeSliderRange {
        const effectiveVisibleRange = this.getEffectiveVisibleRange();

        if (!this.totalPointCount || !effectiveVisibleRange) {
            return this.createEmptyRange();
        }

        const endIndex = Math.min(
            startIndex + effectiveVisibleRange - 1,
            this.totalPointCount - 1
        );

        return {
            startIndex,
            endIndex,
            startValue: referenceSeries?.data[startIndex]?.x,
            endValue: referenceSeries?.data[endIndex]?.x,
        };
    }

    private buildPreviewSeries(
        activeSeries: IChartRangeSliderSeries[]
    ): IRenderedChartRangeSliderSeries[] {
        if (!activeSeries.length) {
            return [];
        }

        const yDomain = this.getYDomain(activeSeries);

        return activeSeries.map((series) => ({
            id: series.id,
            color: series.color ?? "#3f85af",
            areaPath: this.buildAreaPath(series, yDomain),
            linePath: this.buildLinePath(series, yDomain),
        }));
    }

    private buildAreaPath(
        series: IChartRangeSliderSeries,
        yDomain: IYDomain
    ): string {
        if (!series.data.length) {
            return "";
        }

        const baseline = this.scaleY(yDomain.baseline, yDomain);
        const firstX = this.scaleX(0, series.data.length);
        const lastX = this.scaleX(series.data.length - 1, series.data.length);
        const points = series.data
            .map(
                (point, index) =>
                    `L ${this.scaleX(index, series.data.length)} ${this.scaleY(
                        point.y,
                        yDomain
                    )}`
            )
            .join(" ");

        return `M ${firstX} ${baseline} ${points} L ${lastX} ${baseline} Z`;
    }

    private buildLinePath(
        series: IChartRangeSliderSeries,
        yDomain: IYDomain
    ): string {
        return series.data
            .map((point, index) => {
                const command = index === 0 ? "M" : "L";
                return `${command} ${this.scaleX(
                    index,
                    series.data.length
                )} ${this.scaleY(point.y, yDomain)}`;
            })
            .join(" ");
    }

    private getActiveSeries(): IChartRangeSliderSeries[] {
        return (this.series ?? []).filter(
            (series) => (series.active ?? true) && series.data?.length
        );
    }

    private getReferenceSeries(
        series: IChartRangeSliderSeries[]
    ): IChartRangeSliderSeries | undefined {
        return series.reduce<IChartRangeSliderSeries | undefined>(
            (longestSeries, currentSeries) => {
                if (
                    !longestSeries ||
                    currentSeries.data.length > longestSeries.data.length
                ) {
                    return currentSeries;
                }

                return longestSeries;
            },
            undefined
        );
    }

    private getTotalPointCount(series: IChartRangeSliderSeries[]): number {
        return series.reduce(
            (maxLength, currentSeries) =>
                Math.max(maxLength, currentSeries.data.length),
            0
        );
    }

    private getYDomain(series: IChartRangeSliderSeries[]): IYDomain {
        const values = series.reduce<number[]>((result, currentSeries) => {
            currentSeries.data.forEach((point) => result.push(point.y));
            return result;
        }, []);

        const rawMin = values.length ? Math.min(...values) : 0;
        const rawMax = values.length ? Math.max(...values) : 0;
        const min = Math.min(rawMin, 0);
        const max = rawMax === min ? min + 1 : rawMax;

        return {
            min,
            max,
            baseline: min,
        };
    }

    private getEffectiveVisibleRange(): number {
        if (!this.totalPointCount) {
            return 0;
        }

        const normalizedVisibleRange = Math.max(
            0,
            Math.floor(this.visibleRange)
        );

        return Math.min(normalizedVisibleRange, this.totalPointCount);
    }

    private getClampedSelectionIndex(value: number): number {
        const effectiveVisibleRange = this.getEffectiveVisibleRange();

        if (!this.totalPointCount || !effectiveVisibleRange) {
            return 0;
        }

        const maxStartIndex = Math.max(
            this.totalPointCount - effectiveVisibleRange,
            0
        );

        return this.clamp(Math.round(value), 0, maxStartIndex);
    }

    private getPointerPosition(event: MouseEvent): number {
        const rect = this.track.nativeElement.getBoundingClientRect();

        if (!rect.width) {
            return 0;
        }

        return this.clamp(
            ((event.clientX - rect.left) / rect.width) * this.viewBoxWidth,
            0,
            this.viewBoxWidth
        );
    }

    private scaleX(index: number, pointCount: number): number {
        if (pointCount <= 1) {
            return this.viewBoxWidth / 2;
        }

        return (index / (pointCount - 1)) * this.viewBoxWidth;
    }

    private scaleY(value: number, domain: IYDomain): number {
        return (
            this.height -
            ((value - domain.min) / (domain.max - domain.min)) * this.height
        );
    }

    private createEmptyRange(): IChartRangeSliderRange {
        return {
            startIndex: 0,
            endIndex: 0,
        };
    }

    private canInteract(): boolean {
        return this.totalPointCount > 0 && this.getEffectiveVisibleRange() > 0;
    }

    private clamp(value: number, min: number, max: number): number {
        return Math.min(Math.max(value, min), max);
    }
}
