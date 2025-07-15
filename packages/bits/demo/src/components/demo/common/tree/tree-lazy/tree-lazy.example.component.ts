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
import {
    CdkNestedTreeNode,
    CdkTree,
    NestedTreeControl,
} from "@angular/cdk/tree";
import {
  Component,
  Injectable,
  IterableDiffer,
  IterableDiffers,
  viewChild
} from "@angular/core";
import { Observable, of } from "rxjs";
import { delay } from "rxjs/operators";

import { expand } from "@nova-ui/bits";

interface FoodNode {
    name: string;
    children?: FoodNode[];
    length?: number;
    isLoading?: boolean;
}

const TREE_DATA: FoodNode[] = [
    {
        name: "Fruit",
        children: [],
        length: 3,
        isLoading: false,
    },
];

@Injectable()
class HttpMock {
    get(): Observable<FoodNode[]> {
        const res: FoodNode[] = [
            { name: "Banana" },
            {
                name: "Fruit",
                children: [],
                length: 3,
                isLoading: false,
            },
            { name: "Fruit loops" },
        ];
        return of(res).pipe(delay(3000));
    }
}

@Component({
    selector: "nui-tree-lazy-example",
    templateUrl: "./tree-lazy.example.component.html",
    styleUrls: ["./tree-lazy.component.example.less"],
    animations: [expand],
    providers: [HttpMock],
    standalone: false,
})
export class TreeLazyExampleComponent {
    treeControl = new NestedTreeControl<FoodNode>((node) => node.children);
    dataSource = new ArrayDataSource(TREE_DATA);

    private readonly cdkTree = viewChild(CdkTree);

    hasChild = (_: number, node: FoodNode): boolean => !!node.length;

    constructor(private http: HttpMock, private differ: IterableDiffers) {}

    loadMore(node: FoodNode, nestedNode: CdkNestedTreeNode<any>): void {
        const differ: IterableDiffer<FoodNode> = this.differ
            .find(node.children)
            .create();

        if (node.children?.length === node.length || node.isLoading) {
            return;
        }

        node.isLoading = true;

        this.http.get().subscribe((res: FoodNode[]) => {
            node.isLoading = false;
            node.children = res;
            this.cdkTree().renderNodeChanges(
                node.children,
                differ,
                nestedNode.nodeOutlet.first.viewContainer,
                node
            );
        });
    }
}
