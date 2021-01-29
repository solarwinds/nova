import {
    ElementRef,
    EventEmitter,
    Injectable,
    NgZone,
    QueryList,
} from "@angular/core";
import ResizeObserver from "resize-observer-polyfill";

import { ChipComponent } from "./chip/chip.component";
import { IChipsGroup, IChipsItem, IChipsItemsSource } from "./public-api";

@Injectable()
export class ChipsOverflowService {

    public itemsSource: IChipsItemsSource;
    public mainCell: ElementRef<HTMLElement>;
    public allChips: QueryList<ChipComponent | ElementRef<HTMLElement>>;
    public overflowCounter: ElementRef<HTMLElement>;
    public overflowLinesNumber: number;
    public chipsOverflowed: EventEmitter<IChipsItemsSource> = new EventEmitter<IChipsItemsSource>();

    private overflowedChips: IChipsItemsSource;
    private chipResizeObserver: ResizeObserver;
    private chipsMutationObserver: MutationObserver;

    constructor(private zone: NgZone) {
    }

    public init() {
        this.initChipResizeObserver();
        this.initChipsMutationObserver();
    }

    public handleOverflow(): void {
        this.overflowedChips = {
            flatItems: [],
            groupedItems: [],
        };

        this.processChipsOverflow();
        this.chipsOverflowed.emit(this.overflowedChips);
    }

    public onDestroy(): void {
        this.chipResizeObserver?.disconnect();
        this.chipsMutationObserver?.disconnect();
    }

    private initChipResizeObserver(): void {
        if (!this.allChips.first) {
            return;
        }

        this.chipResizeObserver = new ResizeObserver(() => {
            this.zone.run(() => this.handleOverflow());
        });
        // Rendering occurs gradually, so we tracking every dimension change, to calculate overflow items correctly
        // to avoid case when Overflow Counter renders on the next line. Observing occurs only on first item, but it
        // also indicates that other items on the same level of DOM is also rendered
        this.chipResizeObserver.observe(this.getNativeElement(this.allChips.first));
    }

    private initChipsMutationObserver(): void {
        const config = { childList: true };
        this.chipsMutationObserver = new MutationObserver(() => this.handleOverflow());
        this.chipsMutationObserver.observe(this.mainCell.nativeElement, config);
    }

    private processChipsOverflow(): void {
        let acc = 0;
        let chipsOverflow = false;

        const linesDiff: number[] = [];
        const mainCellWidth = this.mainCell?.nativeElement.getBoundingClientRect().width;
        const counterWidth = this.overflowCounter?.nativeElement.getBoundingClientRect().width || 0;

        this.allChips.toArray().forEach((item: ElementRef | ChipComponent) => {
            const chipElement = this.getNativeElement(item);
            chipElement.style.display = "inline";
            const chipElementWidth = chipElement.getBoundingClientRect().width;
            const isLastLine = () => linesDiff.length >= this.overflowLinesNumber - 1;

            if (!isLastLine() && toFixed(acc + chipElementWidth, 2) > toFixed(mainCellWidth, 2)) {
                linesDiff.push(mainCellWidth - acc);
                acc = 0;
            }

            if (isLastLine() && toFixed(acc + chipElementWidth + counterWidth, 2) > toFixed(mainCellWidth, 2)) {
                linesDiff.push(mainCellWidth - acc - counterWidth);
                acc = 0;
                chipsOverflow = true;
            }

            acc += chipElementWidth;

            if (isLastLine() && chipsOverflow) {
                chipElement.style.display = "none";
                this.updateOverflowChips(item);
            }
        });
    }

    private updateOverflowChips(item: ElementRef | ChipComponent): void {
        const chip = this.findChipItem(item);

        if (chip?.inFlat) {
            this.overflowedChips.flatItems?.push((item as ChipComponent).item);
        }

        if (chip?.inGroup) {
            const groupId = this.itemsSource.groupedItems?.indexOf(chip.inGroup);
            const existingGroup = this.overflowedChips.groupedItems?.find(group => group.id === `group${groupId}`);

            if (existingGroup) {
                existingGroup.items.push((item as ChipComponent).item);
                return;
            }

            this.overflowedChips.groupedItems?.push({
                id: `group${groupId}`,
                items: [(item as ChipComponent).item],
                label: chip.inGroup.label,
            });
        }
    }

    private findChipItem(item: ElementRef | ChipComponent): { inFlat?: IChipsItem, inGroup?: IChipsGroup } | undefined {
        if (!(item instanceof ChipComponent)) {
            return;
        }
        const inFlat = this.itemsSource.flatItems?.find(i => i === item.item);
        const inGroup = this.itemsSource.groupedItems?.find(group => group.items.find(i => i === item.item));
        return { inFlat, inGroup };
    }

    private getNativeElement(item: ChipComponent | ElementRef): HTMLElement {
        return item instanceof ChipComponent ? item.host.nativeElement : item.nativeElement;
    }
}

function toFixed(num: number, fixed: number): number {
    const re = new RegExp("^-?\\d+(?:\.\\d{0," + (fixed || -1) + "})?");
    return +(num.toString().match(re) as RegExpMatchArray)[0];
}
