import { Component } from "@angular/core";
import { IMenuGroup } from "@nova-ui/bits";

@Component({
    selector: "nui-toolbar-test",
    templateUrl: "./toolbar-test.component.html",
})

export class ToolbarTestExampleComponent {
    public width = "800px";

    public showFirst = true;

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

    public select = {
        current: 1,
        total: 72,
    };

    public onOptionChange(value: string) {
        this.width = value;
    }

    public onToggle() {
        this.showFirst = !this.showFirst;
    }
}
