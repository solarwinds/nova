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
                    {
                        name: "Brussels sprouts",
                        textStyle: TextStyle.SECONDARY,
                    },
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
    standalone: false
})
export class TreeStylingExampleComponent {
    treeControl = new NestedTreeControl<FoodNode>((node) => node.children);
    dataSource = new ArrayDataSource(TREE_DATA);
    textStyles: typeof TextStyle = TextStyle;

    hasChild = (_: number, node: FoodNode): boolean => !!node.children?.length;
}
