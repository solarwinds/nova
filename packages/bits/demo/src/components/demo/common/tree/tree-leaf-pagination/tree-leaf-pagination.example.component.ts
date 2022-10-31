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
    IterableDiffer,
    IterableDiffers,
    ViewChild,
} from "@angular/core";

import { EventBusService, expand } from "@nova-ui/bits";

import { HttpMockService } from "../http-mock.service";

interface FoodNode {
    name: string;
    page?: number;
    children?: FoodNode[];
    isLoading?: boolean;
    hasPagination?: boolean;
}

interface IApiResponse {
    items: FoodNode[];
    total: number;
}

const TREE_DATA: FoodNode[] = [
    {
        name: "Food",
        children: [
            {
                name: "Vegetables",
                children: [],
                hasPagination: true,
            },
            {
                name: "Fruits",
                children: [],
                hasPagination: true,
            },
        ],
    },
];

@Component({
    selector: "nui-tree-leaf-pagination-example",
    templateUrl: "./tree-leaf-pagination.example.component.html",
    styleUrls: ["./tree-leaf-pagination.component.example.less"],
    animations: [expand],
    providers: [HttpMockService],
})
export class TreeLeafPaginationExampleComponent {
    public pageSize = 25; // used for 'nui-paginator'
    public nodesTotalItems: { [key: string]: number } = {};

    public treeControl = new NestedTreeControl<FoodNode>(
        (node) => node.children
    );
    public dataSource = new ArrayDataSource(TREE_DATA);

    @ViewChild(CdkTree) private cdkTree: CdkTree<FoodNode>;

    hasChild = (_: number, node: FoodNode) => node.children;

    constructor(
        private http: HttpMockService,
        private differ: IterableDiffers,
        private eventBusService: EventBusService
    ) {}

    /** Load first page on first open */
    public onToggleClick(node: FoodNode, nestedNode: CdkNestedTreeNode<any>) {
        this.eventBusService
            .getStream({ id: "document-click" })
            .next(new MouseEvent("click"));

        if (node.hasPagination && node.children && !node.children.length) {
            const paginatorOptions = {
                page: 1,
                pageSize: this.pageSize,
            };

            this.loadNodeItems(node, nestedNode, paginatorOptions);
        }
    }

    public loadNodeItems(
        node: FoodNode,
        nestedNodeDirective: CdkNestedTreeNode<any>,
        paginatorOptions: any
    ): void {
        if (node.isLoading) {
            return;
        }

        node.isLoading = true;

        this.http
            .getNodeItems(
                node.name,
                paginatorOptions.page,
                paginatorOptions.pageSize
            )
            .subscribe((res: IApiResponse) => {
                this.handleNodeTotalItems(node.name, res.total);
                this.handleNodeContent(node, nestedNodeDirective, res.items);
                node.isLoading = false;
            });
    }

    private handleNodeTotalItems(nodeId: string, totalItems: number) {
        this.nodesTotalItems[nodeId] = totalItems;
    }

    private handleNodeContent(
        node: FoodNode,
        nestedNodeDirective: CdkNestedTreeNode<any>,
        items: FoodNode[]
    ) {
        node.children = [];
        const differ: IterableDiffer<FoodNode> = this.differ
            .find(node.children)
            .create();
        node.children = items;

        // clear previously rendered leaf nodes
        nestedNodeDirective.nodeOutlet.first.viewContainer.clear();
        this.cdkTree.renderNodeChanges(
            node.children,
            differ,
            nestedNodeDirective.nodeOutlet.first.viewContainer,
            node
        );
    }
}
