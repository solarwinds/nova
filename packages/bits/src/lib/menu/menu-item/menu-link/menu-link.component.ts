import {
    ChangeDetectorRef,
    Component,
    ElementRef,
    forwardRef,
    Input,
    Optional,
    ViewChild,
    ViewEncapsulation
} from "@angular/core";

import { MenuGroupComponent } from "../menu-group/menu-group.component";
import { MenuItemBaseComponent } from "../menu-item/menu-item-base";

/**
 * @ignore
 */

/**
 * Represents menu link item of nui-menu component with additional bindings and style
 */
@Component({
    selector: "nui-menu-link",
    template: `
        <a class="nui-menu-item__link" role="link"
           [href]="url"
           [target]="target"
           (click)="handleClick($event)"
           #menuLink>

            <nui-icon *ngIf="icon" [icon]="icon"></nui-icon>
            <ng-content></ng-content>
        </a>
    `,
    providers: [
        {
            provide: MenuItemBaseComponent,
            useExisting: forwardRef(() => MenuLinkComponent),
        },
    ],
    styleUrls: ["./menu-link.component.less"],
    encapsulation: ViewEncapsulation.None,
})
export class MenuLinkComponent extends MenuItemBaseComponent {
    /**
     * Sets inner "href" attribute of anchor tag
     */
    @Input() public url: string;
    /**
     * Sets inner "target" attribute of anchor tag
     */
    @Input() public target = "";
    /**
     * Adds icon by specified icon name
     */
    @Input() public icon: string;
    @ViewChild("menuLink") menuItem: ElementRef;

    constructor(@Optional() readonly group: MenuGroupComponent, cd: ChangeDetectorRef) {
        super(group, cd);

        this.disabled = false;
    }

    public handleClick(event: MouseEvent): void {
        if (this.disabled) {
            event.preventDefault();
            event.stopPropagation();
        }
        this.actionDone.emit();
    }

    public doAction(): void {
        this.menuItem.nativeElement.click();
        this.actionDone.emit();
    }
}
