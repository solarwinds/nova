import { ArrayDataSource } from "@angular/cdk/collections";
import { NestedTreeControl } from "@angular/cdk/tree";
import { Component } from "@angular/core";
import { expand } from "@nova-ui/bits";


interface FoodNode {
    name: string;
    textStyle?: string;
    icon?: string;
    children?: FoodNode[];
}

enum TextStyle {
    DEFAULT = "nui-text-default",
    SECONDARY = "nui-text-secondary",
    LABEL = "nui-text-label",
}

const TREE_DATA: FoodNode[] = [
    {
        name: "Custom Icons",
        textStyle: "default",
        icon: "email",
        children: [
            { name: "Apple", icon: "move-down" },
            { name: "Carambola", icon: "add" },
            { name: "Grapefruit", icon: "schedule" },
        ],
    },
    {
        name: "Custom Text Styles",
        textStyle: TextStyle.SECONDARY,
        children: [
            {
                name: "Green",
                textStyle: TextStyle.DEFAULT,
                children: [
                    { name: "Broccoli", textStyle: TextStyle.LABEL },
                    { name: "Brussels sprouts", textStyle: TextStyle.SECONDARY },
                ],
            },
            {
                name: "Orange",
                children: [
                    { name: "Pumpkins" },
                    { name: "Carrots", textStyle: TextStyle.SECONDARY },
                ],
            },
            { name: "Red", textStyle: TextStyle.LABEL },
        ],
    },
];


@Component({
    selector: "nui-tree-styling-example",
    templateUrl: "tree-styling.example.component.html",
    styleUrls: ["tree-styling.example.component.less"],
    animations: [expand],
})

export class TreeStylingExampleComponent {
    treeControl = new NestedTreeControl<FoodNode>((node) => node.children);
    dataSource = new ArrayDataSource(TREE_DATA);
    textStyles: typeof TextStyle = TextStyle;

    hasChild = (_: number, node: FoodNode) => !!node.children && node.children.length > 0;
}
