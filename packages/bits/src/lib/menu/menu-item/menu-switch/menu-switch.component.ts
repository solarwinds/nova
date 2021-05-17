import {
    ChangeDetectorRef,
    Component,
    ElementRef,
    forwardRef,
    HostBinding,
    HostListener,
    Input,
    Optional,
    ViewChild,
    ViewEncapsulation,
} from "@angular/core";

import { MenuGroupComponent } from "../menu-group/menu-group.component";
import { MenuItemBaseComponent } from "../menu-item/menu-item-base";

/**
 * @ignore
 */

/**
 * Menu item component with check/uncheck option,
 * use (change) event to get state of this item
 */
@Component({
    selector: "nui-menu-switch",
    template: `
        <div class="nui-menu-item__switch" tabindex="0" #menuSwitch tabIndex="-1">
            <nui-switch
                [value]="checked"
                [disabled]="disabled">
                <ng-content></ng-content>
            </nui-switch>
        </div>
    `,
    providers: [
        {
            provide: MenuItemBaseComponent,
            useExisting: forwardRef(() => MenuSwitchComponent),
        },
    ],
    styleUrls: ["./menu-switch.component.less"],
    encapsulation: ViewEncapsulation.None,
    host: { "role": "menuitemcheckbox" },
})
export class MenuSwitchComponent extends MenuItemBaseComponent {

    /**
     * Is needed to predefine item state, sets nui-checkbox [checked] property
     */
    @Input() public checked: boolean;

    @Input() public disabled: boolean;
    @ViewChild("menuSwitch") menuItem: ElementRef;

    @HostListener("click", ["$event"])
    public stopPropagationOfClick(event: MouseEvent) {
        event.stopPropagation();
        if (!this.disabled) {
            event.preventDefault();
            this.checked = !this.checked;
            this.actionDone.emit(this.checked);
        }
    }

    @HostBinding("class.checked")
    public get checkedClass() {
        return this.checked;
    }

    constructor(@Optional() readonly group: MenuGroupComponent, cd: ChangeDetectorRef) {
        super(group, cd);
        this.checked = false;

        // Is needed to predefine item state, sets nui-switch [disabled] property
        this.disabled = false;
    }

    public doAction(): void {
        this.checked = !this.checked;
        this.actionDone.emit(this.checked);
    }
}
