import {
    ChangeDetectorRef,
    Component,
    Input,
    OnChanges,
} from "@angular/core";

import { IHasChangeDetector } from "../../../../types";

@Component({
    template: `
        <ng-container *ngIf="isValid">
            <div class="nui-text-label align-items-center status-icon-formatter">
                <span class="nui-text-ellipsis text-right pl-3">{{ data.data }}</span>
                <nui-icon [icon]="data.icon" class="mx-2"></nui-icon>
                <span class="nui-text-ellipsis" [style.font-size.px]="11">{{data.name}}</span>
            </div>
        </ng-container>
    `,
    styles: [`.status-icon-formatter {display: grid; grid-template-columns: 50px auto  minmax(114px, 1fr);} `],
})
export class StatusWithIconFormatterComponent implements OnChanges, IHasChangeDetector {
    static lateLoadKey = "StatusWithIconFormatterComponent";

    constructor(public changeDetector: ChangeDetectorRef) { }

    public isValid: boolean = false;
    @Input() data: {name: string, icon: string, data: number[]};

    ngOnChanges() {
        this.isValid = !!(this.data
            && this.data.icon
            && this.data.name
            && this.data.data);
    }
}
