import { Component } from "@angular/core";
import { IMenuGroup } from "@nova-ui/bits";

@Component({
    selector: "nui-menu-test",
    templateUrl: "./menu-test.component.html",
})
export class MenuTestComponent {
    public itemsSource: IMenuGroup[] = [
        {
            header: "section title",
            itemsSource: [
                {
                    title: "Menu Item",
                    itemType: "action",
                    action: this.actionDone,
                },
                { title: "Selected menu item", isSelected: true },
                {
                    title: "Switched checked",
                    itemType: "switch",
                    checked: true,
                },
                {
                    title: "Switch unchecked",
                    itemType: "switch",
                    checked: false,
                },
                {
                    title: "Disabled switch",
                    itemType: "switch",
                    disabled: true,
                    checked: false,
                },
                {
                    title: "Disabled action",
                    itemType: "action",
                    disabled: true,
                },
                {
                    title: "Disabled link",
                    itemType: "link",
                    url: "#button",
                    disabled: true,
                },
                {
                    title: "Disabled option",
                    itemType: "option",
                    disabled: true,
                    checked: false,
                },
                { title: "Menu item with checkbox", itemType: "option" },
                {
                    title: "Menu item with icon",
                    itemType: "action",
                    icon: "table",
                },
                { title: "Link menu item", itemType: "link", url: "#button" },
                {
                    title: "Export PDF",
                    itemType: "link",
                    icon: "export-pdf",
                    url: "#button",
                },
            ],
        },
        {
            header: "section 2 title",
            itemsSource: [
                {
                    title: "Menu Item1",
                    itemType: "option",
                    action: this.actionDone,
                },
                {
                    title: "Menu Item2",
                    itemType: "option",
                    action: this.actionDone,
                },
                {
                    title: "Menu Item3",
                    itemType: "option",
                    action: this.actionDone,
                },
            ],
        },
    ];

    public actionDone(): void {
        console.log("Action Done");
    }
}
