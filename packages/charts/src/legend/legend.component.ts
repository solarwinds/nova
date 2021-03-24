import { Component, EventEmitter, Input, OnChanges, OnDestroy, SimpleChanges, ViewEncapsulation } from "@angular/core";

import { LegendOrientation } from "./types";

@Component({
    selector: "nui-legend",
    // eslint-disable-next-line
    host: { "class": "d-inline-block" },
    templateUrl: "./legend.component.html",
    encapsulation: ViewEncapsulation.Emulated,
})
export class LegendComponent implements OnChanges, OnDestroy {
    /**
     * EventEmitter for notifying subscribers of a change in the active state
     */
    public activeChanged = new EventEmitter<boolean>();

    /**
     * The active state
     */
    @Input() public active = false;

    /**
     * The legend's interactive mode switch
     */
    @Input() public interactive = false;

    /**
     * The legend's orientation
     */
    @Input() public orientation: LegendOrientation = LegendOrientation.vertical;

    /**
     * The legend's overall series color. Individual legend series may override this.
     */
    @Input() public seriesColor: string;

    /**
     * The legend's overall series icon. Individual legend series may override this.
     */
    @Input() public seriesIcon: string;

    /**
     * The legend's overall series unit label. Individual legend series may override this.
     */
    @Input() public seriesUnitLabel: string;

    public ngOnChanges(changes: SimpleChanges) {
        if (changes["active"]) {
            this.activeChanged.emit(this.active);
        }
    }

    public ngOnDestroy(): void {
        this.activeChanged.complete();
    }

}
