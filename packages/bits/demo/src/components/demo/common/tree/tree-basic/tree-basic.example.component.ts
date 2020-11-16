import { ArrayDataSource } from "@angular/cdk/collections";
import { NestedTreeControl } from "@angular/cdk/tree";
import { Component } from "@angular/core";
import { expand } from "@solarwinds/nova-bits";


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
    selector: "nui-tree-basic-example",
    templateUrl: "tree-basic.example.component.html",
    styleUrls: ["tree-basic.example.component.less"],
    host: { id: "nui-tree-basic-example" },
    animations: [expand],
})
export class TreeBasicExampleComponent {
    treeControl = new NestedTreeControl<FoodNode>((node) => node.children);
    dataSource = new ArrayDataSource(TREE_DATA);

    hasChild = (_: number, node: FoodNode) => !!node.children && node.children.length > 0;
}
