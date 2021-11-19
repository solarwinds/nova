import { AfterContentInit, Component, EventEmitter, Input, Output } from "@angular/core";

import { ToolbarItemDisplayStyle, ToolbarItemType } from "./public-api";
/**
 * @ignore
 */

@Component({
    selector: "nui-toolbar-item",
    template: "<ng-content></ng-content>",
    host: { "class": "nui-toolbar-item" },
})

export class ToolbarItemComponent implements AfterContentInit {
    @Input() public type = ToolbarItemType.primary;
    @Input() public icon: string;
    @Input() public title: string;
    /**
     * Property for add destructive style to toolbar item.
     * Destructive item should be added always last by user.
     */

    @Input() public displayStyle = ToolbarItemDisplayStyle.action;
    public menuHidden: boolean;

    @Output() public actionDone = new EventEmitter();

    public get isDestructive(): boolean {
        return this.displayStyle === ToolbarItemDisplayStyle.destructive;
    }

    ngAfterContentInit(): void {
        this.menuHidden = this.type === ToolbarItemType.secondary;
    }
}
