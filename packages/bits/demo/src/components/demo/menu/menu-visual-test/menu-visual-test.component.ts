import { Component } from "@angular/core";
import { IMenuGroup, MenuActionType } from "@nova-ui/bits";

@Component({
    selector: "nui-menu-visual-test",
    templateUrl: "./menu-visual-test.component.html",
})
export class MenuVisualTestComponent {
    public itemsSource: IMenuGroup[] = [
        {
            header: "Group 1",
            itemsSource: [
                {
                    title: "Item 1",
                    itemType: "action",
                    action: this.actionDone,
                },
                {
                    title: "Item 2",
                    itemType: "action",
                    action: () => alert("hello"),
                },
                {
                    title: "Item 3",
                    itemType: "action",
                    action: this.actionWithParams.bind(this, 2),
                },
                {
                    title: "Item 4",
                    itemType: "action",
                    action: this.actionDone,
                },
                {
                    title: "Item 5",
                    itemType: "action",
                    action: this.actionDone,
                },
                {
                    title: "Item 6",
                    itemType: "action",
                    action: this.actionDone,
                },
            ],
        },
        {
            itemsSource: [
                {
                    title: "Item 7",
                    itemType: "action",
                    action: this.actionDone,
                },
                {
                    title: "Item 8",
                    itemType: "action",
                    action: this.actionDone,
                },
                {
                    title: "Item 9",
                    itemType: "action",
                    action: this.actionDone,
                },
                {
                    title: "Item 10",
                    itemType: "action",
                    action: this.actionDone,
                },
                {
                    title: "Item 11",
                    itemType: "action",
                    action: this.actionDone,
                },
                {
                    title: "Item 12",
                    itemType: "action",
                    action: this.actionDone,
                },
                {
                    title: "Item 13",
                    itemType: "action",
                    action: this.actionDone,
                    disabled: true,
                },
                {
                    title: "Item 14",
                    itemType: "action",
                    action: this.actionDone,
                    itemClass: MenuActionType.destructive,
                },
            ],
        },
    ];

    public itemsSourceVariations: IMenuGroup[] = [
        {
            header: "section title",
            itemsSource: [
                {
                    title: "Menu Item",
                    itemType: "action",
                    action: this.actionDone,
                },
                {
                    title: "Hover me",
                    itemType: "action",
                    action: this.actionDone,
                },
                { title: "Selected menu item", isSelected: true },
                { title: "Menu item", itemType: "switch", checked: true },
                {
                    title: "Menu disabled item with long text",
                    itemType: "switch",
                    checked: false,
                    disabled: true,
                },
                {
                    title: "Menu item with checkbox",
                    itemType: "option",
                    disabled: true,
                },
                {
                    title: "Menu item with icon",
                    itemType: "action",
                    icon: "table",
                },
                {
                    title: "Link menu item",
                    itemType: "link",
                    url: "#button",
                    disabled: true,
                },
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

    public actionWithParams(index: number) {
        console.log("action", this.itemsSource[0].itemsSource[index].title);
    }
}
