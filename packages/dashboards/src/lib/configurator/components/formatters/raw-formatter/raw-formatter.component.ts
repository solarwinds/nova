import { ChangeDetectorRef, Component, HostBinding, Input } from "@angular/core";

import { IFormatterData } from "../types";

@Component({
    template: `
        <ng-container>{{displayValue}}</ng-container>`,
})
export class RawFormatterComponent {
    static lateLoadKey = "RawFormatterComponent";

    constructor(public changeDetector: ChangeDetectorRef) {
    }

    @Input() data: IFormatterData;

    @Input()
    @HostBinding("class")
    public elementClass: string;

    public get displayValue(): string {
        const valueAsNumber = parseFloat(this.data?.value);
        if (isNaN(valueAsNumber)) {
            return this.data?.value;
        }
        return valueAsNumber.toLocaleString();
    }
}
