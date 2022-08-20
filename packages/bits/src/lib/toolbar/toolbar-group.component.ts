import { Component, ContentChildren, Input, QueryList } from "@angular/core";

import { ToolbarItemComponent } from "./toolbar-item.component";
/**
 * @ignore
 */
@Component({
    selector: "nui-toolbar-group",
    template: ` <ng-content></ng-content> `,
})
export class ToolbarGroupComponent {
    @Input() title: string;

    @ContentChildren(ToolbarItemComponent)
    public items: QueryList<ToolbarItemComponent>;
}
