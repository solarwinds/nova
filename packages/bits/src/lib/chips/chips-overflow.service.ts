// © 2022 SolarWinds Worldwide, LLC. All rights reserved.
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
//  of this software and associated documentation files (the "Software"), to
//  deal in the Software without restriction, including without limitation the
//  rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
//  sell copies of the Software, and to permit persons to whom the Software is
//  furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
//  all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
//  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
//  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
//  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
//  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
//  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
//  THE SOFTWARE.

import {
    ElementRef,
    EventEmitter,
    Injectable,
    NgZone,
    QueryList,
} from "@angular/core";

import { ChipComponent } from "./chip/chip.component";
import { IChipsGroup, IChipsItem, IChipsItemsSource } from "./public-api";

@Injectable()
export class ChipsOverflowService {
    public itemsSource: IChipsItemsSource;
    public mainCell: ElementRef<HTMLElement>;
    public clearAll: ElementRef<HTMLElement>;
    public nuiChips: ElementRef<HTMLElement>;
    public allChips: QueryList<ChipComponent | ElementRef<HTMLElement>>;
    public overflowCounter: ElementRef<HTMLElement>;
    public overflowLinesNumber: number;
    public chipsOverflowed: EventEmitter<IChipsItemsSource> =
        new EventEmitter<IChipsItemsSource>();

    private overflowedChips: IChipsItemsSource;
    private chipResizeObserver: ResizeObserver;
    private chipsMutationObserver: MutationObserver;

    constructor(private zone: NgZone) {}

    public init(): void {
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
        this.chipResizeObserver.observe(
            this.getNativeElement(this.allChips.first)
        );
    }

    private initChipsMutationObserver(): void {
        const config = { childList: true };
        this.chipsMutationObserver = new MutationObserver(() =>
            this.handleOverflow()
        );
        this.chipsMutationObserver.observe(this.mainCell.nativeElement, config);
    }

    private processChipsOverflow(): void {
        let acc = 0;
        let renderedLines = 1;
        let chipsOverflow = false;

        const rowMaxWidth = this.getRowWidth();
        const counterWidth =
            this.overflowCounter?.nativeElement.getBoundingClientRect().width ||
            0;

        this.allChips.toArray().forEach((item: ElementRef | ChipComponent) => {
            const chipElement = this.getNativeElement(item);
            chipElement.style.display = "inline";
            const chipElementWidth = chipElement.getBoundingClientRect().width;
            const isLastLine = () => renderedLines === this.overflowLinesNumber;

            if (!isLastLine() && acc + chipElementWidth > rowMaxWidth) {
                renderedLines++;
                acc = 0;
            }

            if (
                isLastLine() &&
                acc + chipElementWidth + counterWidth > rowMaxWidth
            ) {
                acc = 0;
                chipsOverflow = true;

                if (!chipsOverflow) {
                    renderedLines++;
                }
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
            const groupId = this.itemsSource.groupedItems?.indexOf(
                chip.inGroup
            );
            const existingGroup = this.overflowedChips.groupedItems?.find(
                (group) => group.id === `group${groupId}`
            );

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

    private findChipItem(
        item: ElementRef | ChipComponent
    ): { inFlat?: IChipsItem; inGroup?: IChipsGroup } | undefined {
        if (!(item instanceof ChipComponent)) {
            return;
        }
        const inFlat = this.itemsSource.flatItems?.find((i) => i === item.item);
        const inGroup = this.itemsSource.groupedItems?.find((group) =>
            group.items.find((i) => i === item.item)
        );
        return { inFlat, inGroup };
    }

    private getNativeElement(item: ChipComponent | ElementRef): HTMLElement {
        return item instanceof ChipComponent
            ? item.host.nativeElement
            : item.nativeElement;
    }

    private getRowWidth(): number {
        return (
            this.nuiChips?.nativeElement.getBoundingClientRect().width -
            this.clearAll?.nativeElement.getBoundingClientRect().width -
            parseFloat(
                getComputedStyle(this.nuiChips?.nativeElement).paddingLeft
            ) -
            parseFloat(
                getComputedStyle(this.nuiChips?.nativeElement).paddingRight
            )
        );
    }
}
