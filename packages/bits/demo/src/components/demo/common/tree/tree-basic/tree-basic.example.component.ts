// © 2022 SolarWinds Worldwide, LLC. All rights reserved.
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
//  of this software and associated documentation files (the "Software"), to
//  deal in the Software without restriction, including without limitation the
//  rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
//  sell copies of the Software, and to permit persons to whom the Software is
//  furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
//  all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
//  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
//  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
//  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
//  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
//  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
//  THE SOFTWARE.

import { ArrayDataSource } from "@angular/cdk/collections";
import { NestedTreeControl } from "@angular/cdk/tree";
import { Component } from "@angular/core";

import { expand } from "@nova-ui/bits";

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

    hasChild = (_: number, node: FoodNode) =>
        !!node.children && node.children.length > 0;
}
