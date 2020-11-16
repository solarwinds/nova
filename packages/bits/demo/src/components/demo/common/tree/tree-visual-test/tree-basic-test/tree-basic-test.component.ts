import { ArrayDataSource } from "@angular/cdk/collections";
import { NestedTreeControl } from "@angular/cdk/tree";
import { Component } from "@angular/core";
import { expand } from "@solarwinds/nova-bits";

import {FoodNode, TREE_DATA} from "../data";

@Component({
  selector: "nui-tree-basic-test",
  templateUrl: "./tree-basic-test.component.html",
  styleUrls: ["./tree-basic-test.component.less"],
  host: { id: "nui-tree-basic-example" },
  animations: [expand],
})

export class TreeBasicTestComponent {
    treeControl = new NestedTreeControl<FoodNode>((node) => node.children);
    dataSource = new ArrayDataSource(TREE_DATA);

    hasChild = (_: number, node: FoodNode) => !!node.children && node.children.length > 0;
}
