import { ArrayDataSource } from "@angular/cdk/collections";
import { NestedTreeControl } from "@angular/cdk/tree";
import { Component } from "@angular/core";
import { EventBusService, expand } from "@solarwinds/nova-bits";


interface FoodNode {
    name: string;
    children?: FoodNode[];
}

const TREE_DATA: FoodNode[] = [
    {
        name: "Fruit",
        children: [
            { name: "Apple" },
            { name: "Banana" },
            { name: "Fruit loops" },
        ],
    },
    {
        name: "Vegetables",
        children: [
            {
                name: "Green",
                children: [{ name: "Broccoli" }, { name: "Brussels sprouts" }],
            },
            {
                name: "Orange",
                children: [{ name: "Pumpkins" }, { name: "Carrots" }],
            },
            {
                name: "Red",
            },
        ],
    },
    {
        name: "Meat",
    },
];


@Component({
    selector: "nui-tree-with-additional-content-example",
    templateUrl: "tree-with-additional-content.example.component.html",
    styleUrls: ["tree-with-additional-content.example.component.less"],
    host: { id: "tree-with-additional-content-example" },
    animations: [expand],
})
export class TreeWithAdditionalContentExampleComponent {
    treeControl = new NestedTreeControl<FoodNode>((node) => node.children);
    dataSource = new ArrayDataSource(TREE_DATA);

    public items = ["Item 1", "Item 2", "Item 3"];

    public hasChild = (_: number, node: FoodNode) => !!node.children && node.children.length > 0;

    constructor(private eventBusService: EventBusService) {
    }

    public onToggleClick() {
        this.eventBusService.getEventStream("document-click").next(new MouseEvent("click"));
    }
}
