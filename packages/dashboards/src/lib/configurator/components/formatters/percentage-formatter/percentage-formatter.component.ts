import { Component } from "@angular/core";

import { RawFormatterComponent } from "../raw-formatter/raw-formatter.component";

@Component({
    template: `
        <ng-container>
            <div *ngIf="data?.link; else noLink">
                    <a class="nui-text-link-small nui-text-ellipsis link"
                        (click)="$event.stopPropagation()"
                        [href]="data?.link"
                        rel="noopener noreferrer"
                        [title]="data?.value">
                            {{data?.value}}%
                    </a>
            </div>
            <ng-template #noLink>
                {{data?.value}}%
            </ng-template>
        </ng-container>`,
})
export class PercentageFormatterComponent extends RawFormatterComponent {
    static lateLoadKey = "PercentageFormatterComponent";
}
