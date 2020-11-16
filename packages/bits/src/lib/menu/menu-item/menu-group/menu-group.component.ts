import { Component, Input, ViewEncapsulation } from "@angular/core";

/** @ignore */
@Component({
    selector: "nui-menu-group",
    template: `
        <ng-container *ngIf="header">
            <div class="nui-menu-item nui-menu-item--header" (click)="stopClickPropagation($event)">{{header}}</div>
        </ng-container>
        <ng-content></ng-content>
        <div (click)="stopClickPropagation($event)" class="nui-menu-group-divider--container">
            <nui-divider size="extra-small"></nui-divider>
        </div>
    `,
    styleUrls: ["./menu-group.component.less"],
    encapsulation: ViewEncapsulation.None,
})

export class MenuGroupComponent {
    @Input() header?: string;

    public stopClickPropagation(event: MouseEvent) {
        event.stopPropagation();
    }
}
