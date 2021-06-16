import { Component, Input } from "@angular/core";
import { IMenuGroup, PanelBackgroundColor } from "@nova-ui/bits";

@Component({
    selector: "nui-panel-test",
    templateUrl: "./panel-test.component.html",
})

export class PanelTestComponent {
    @Input() isOn = true;
    public isCollapsible = true;
    public isCollapsed = false;
    public headerIcon = "filter";
    public headerIconCounter = 7;
    public displayFooter = true;
    public panelColor: PanelBackgroundColor = PanelBackgroundColor.colorBgSecondary;
    public heading = "No Padding Header";
    public itemsSource: IMenuGroup[] = [
        {header: "section title", itemsSource: [
            {title: "Menu Item", itemType: "action"},
            {title: "Hover me", itemType: "action"},
            {title: "Selected menu item", isSelected: true},
            {title: "Menu item", itemType: "switch", checked: true},
            {title: "Menu disabled item", itemType: "switch", checked: false, disabled: true},
            {title: "Menu item with checkbox", itemType: "option", disabled: true},
            {title: "Menu item with icon", itemType: "action", icon: "table"},
            {title: "Link menu item", itemType: "link", url: "#button", disabled: true},
            {title: "Export PDF", itemType: "link", icon: "export-pdf", url: "#button"},
        ]},
    ];

    constructor() {}

    public toggleFooter() {
        this.displayFooter = !this.displayFooter;
    }

    public onCollapseChange($event: boolean) {
        this.isCollapsed = $event;
    }
}
