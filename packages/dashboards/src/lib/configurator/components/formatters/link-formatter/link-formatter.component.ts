import { ChangeDetectorRef, Component, Input, OnChanges, SimpleChanges } from "@angular/core";

import { IHasChangeDetector } from "../../../../types";
import { ILinkFormatterData } from "../types";

@Component({
    template: `<div class="link-formatter-container">
                    <a *ngIf="isValid" class="nui-text-ellipsis" [href]="data?.link" [target]="targetSelf">
                            {{data?.value}}
                    </a>
              </div>`,
    styles: [`.link-formatter-container {display: grid; grid-template-columns: 1fr;}`],
})
export class LinkFormatterComponent implements OnChanges, IHasChangeDetector {
    static lateLoadKey = "LinkFormatterComponent";

    @Input() data: ILinkFormatterData;
    @Input() target?: boolean;

    public targetSelf: string;
    public isValid = false;

    constructor(public changeDetector: ChangeDetectorRef) {
    }

    public ngOnChanges(changes: SimpleChanges) {
        this.isValid = Boolean(this.data && this.data.value && this.data.link);
        this.targetSelf = this.target ? "_self" : "_blank";
    }
}
