import { ChangeDetectorRef, Component, HostBinding, Input, OnChanges, SimpleChanges } from "@angular/core";
import toNumber from "lodash/toNumber";
import toString from "lodash/toString";

import { ISiUnitsPrefix, SI_UNITS_PREFIXES, SI_UNITS_PREFIXES_NEGATIVE } from "../../../../constants/si-units-prefixes";
import { IFormatterData } from "../types";

@Component({
    template: `
        <ng-container>
            <div class="d-flex flex-nowrap">
            <div *ngIf="data.link; else noLink">
                    <a class="nui-text-link-small nui-text-ellipsis link"
                        (click)="$event.stopPropagation()"
                        [href]="data?.link" 
                        rel="noopener noreferrer"
                        [title]="data.value">
                            {{ data.value }}
                    </a>
                    <span> {{ modifier }}</span>
            </div>
            <ng-template #noLink>
                <span>{{ value }}</span>
                <span> {{ modifier }}</span>
            </ng-template>
            </div>
        </ng-container>
    `,
})
export class SiUnitsFormatterComponent implements OnChanges {
    static lateLoadKey = "SiUnitsFormatterComponent";
    // e.g. setting "shiftPoint" to "1" makes "1000k" to be displayed instead of "1M"
    static SHIFT_POINT_DEFAULT = 0;

    @Input() public data: IFormatterData;

    @Input()
    @HostBinding("class")
    public elementClass: string;

    public value: string = "0";
    public modifier: string | undefined;

    constructor(public changeDetector: ChangeDetectorRef) {
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes.data) {
            const { value } = changes.data.currentValue;

            if (value) {
                this.processSiUnitsValue(toString(value));
            }
        }
    }

    protected processSiUnitsValue(value: string) {
        const prefix = this.getTransformPrefix(toNumber(value));

        this.value = this.getTransformedValue(value, prefix);
        this.modifier = prefix?.prefix;
    }

    protected getTransformedValue(value: string, prefix: ISiUnitsPrefix | undefined) {
        if (!prefix) { return value; }

        const transformed = prefix.power !== 1
            ? +value * Math.pow(10, -prefix.power)
            : +value;
        const rounded = Math.round(transformed * 10) / 10; // round to 1 decimal

        return rounded.toString();
    }

    protected getTransformPrefix(origin: number): ISiUnitsPrefix | undefined {
        const value = Math.abs(origin);

        if (Number.isNaN(value)) { return undefined; }

        const shiftPoint = this.data?.shiftPoint || SiUnitsFormatterComponent.SHIFT_POINT_DEFAULT;

        if (value >= 1) {
            const rounded = Math.round(value);
            const roundedStr = rounded.toString();
            const roundedLength = roundedStr.length;

            // iterate over prefixes from higher to lower
            const prefix = [...SI_UNITS_PREFIXES].reverse().find(pref => roundedLength >= pref.power + 1 + shiftPoint);
            return prefix;
        } else {
            const modifier = getValueNegativeModifier(value);
            const prefix = [...SI_UNITS_PREFIXES_NEGATIVE].reverse().find(pref => modifier <= Math.abs(pref.power) + 1 + shiftPoint);
            return prefix;
        }
    }
}

function getValueNegativeModifier(value: number, prevModifier: number = 1): number {
    const val = Math.abs(value);

    if (val >= 1) { return 1; }

    const newModifier = prevModifier + 1;

    return (val * Math.pow(10, newModifier)) > 1
        ? newModifier
        : getValueNegativeModifier(val, newModifier);
}
