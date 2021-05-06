import { ChangeDetectorRef, Component, HostBinding, Input } from "@angular/core";

import { IFormatterData } from "../types";

@Component({
    template: `
        <ng-container>{{localeString}}</ng-container>`,
})
export class RawFormatterComponent {
    static lateLoadKey = "RawFormatterComponent";

    constructor(public changeDetector: ChangeDetectorRef) {
    }

    @Input() data: IFormatterData;

    @Input()
    @HostBinding("class")
    public elementClass: string;

    public get localeString(): string {
        const valueAsNumber = parseFloat(this.data.value);
        if (typeof valueAsNumber === "number") {
            return valueAsNumber.toLocaleString();
        }
        return this.data.value;
    }
}
