import { ChangeDetectorRef, Component, HostBinding, Input } from "@angular/core";

import { IFormatterData } from "../types";

@Component({
    template: `
        <ng-container>{{data?.value}}</ng-container>`,
})
export class RawFormatterComponent {
    static lateLoadKey = "RawFormatterComponent";

    constructor(public changeDetector: ChangeDetectorRef) {
    }

    @Input() data: IFormatterData;

    @Input()
    @HostBinding("class")
    public elementClass: string;
}
