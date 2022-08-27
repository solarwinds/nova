import { ChangeDetectorRef, Component, Input, OnChanges } from "@angular/core";

import { IconService } from "@nova-ui/bits";

import { IHasChangeDetector } from "../../../../types";
import { IFormatterData } from "../types";

@Component({
    template: `
        <div
            *ngIf="isValid"
            class="d-flex align-items-center justify-content-center"
        >
            <nui-icon
                *ngIf="iconFound; else iconNotFound"
                [icon]="data?.value"
            ></nui-icon>
        </div>
        <ng-template #iconNotFound>
            <nui-icon
                title="Unknown icon"
                i18n-title
                iconColor="disabled-gray"
                icon="help"
            ></nui-icon>
        </ng-template>
    `,
})
export class IconFormatterComponent implements OnChanges, IHasChangeDetector {
    static lateLoadKey = "IconFormatterComponent";

    constructor(
        public changeDetector: ChangeDetectorRef,
        public iconService: IconService
    ) {}

    public isValid: boolean = false;
    public iconFound: boolean = true;
    @Input() public data?: IFormatterData;

    ngOnChanges() {
        this.isValid = !!this.data?.value;
        this.iconFound = !!this.iconService.getIconData(this.data?.value);
    }
}
