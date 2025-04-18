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
import { CdkNestedTreeNode, CdkTree, NestedTreeControl, CdkTreeNodeDef, CdkTreeNodeToggle, CdkTreeNodeOutlet } from "@angular/cdk/tree";
import {
    Component,
    IterableDiffer,
    IterableDiffers,
    ViewChild,
} from "@angular/core";

import { DOCUMENT_CLICK_EVENT, EventBusService, expand } from "@nova-ui/bits";

import { FoodNode, HttpMock, IApiResponse, TREE_DATA_PAGINATOR } from "../data";
import { NuiButtonModule } from "../../../../../../../../src/lib/button/button.module";
import { NuiIconModule } from "../../../../../../../../src/lib/icon/icon.module";
import { NuiBusyModule } from "../../../../../../../../src/lib/busy/busy.module";
import { NgIf } from "@angular/common";
import { NuiPaginatorModule } from "../../../../../../../../src/lib/paginator/paginator.module";

@Component({
    selector: "nui-tree-paginator-test",
    templateUrl: "./tree-paginator-test.component.html",
    styleUrls: ["./tree-paginator-test.component.less"],
    host: { id: "nui-tree-paginator-example" },
    animations: [expand],
    providers: [HttpMock],
    imports: [CdkTree, CdkTreeNodeDef, CdkNestedTreeNode, NuiButtonModule, CdkTreeNodeToggle, NuiIconModule, NuiBusyModule, CdkTreeNodeOutlet, NgIf, NuiPaginatorModule]
})
export class TreePaginatorTestComponent {
    public pageSize = 10; // used for 'nui-paginator'
    public nodesTotalItems: { [key: string]: number } = {};

    public treeControl = new NestedTreeControl<FoodNode>(
        (node) => node.children
    );
    public dataSource = new ArrayDataSource(TREE_DATA_PAGINATOR);

    @ViewChild(CdkTree) private cdkTree: CdkTree<FoodNode>;

    hasChild = (_: number, node: FoodNode): boolean => !!node.children;

    constructor(
        private http: HttpMock,
        private differ: IterableDiffers,
        private eventBusService: EventBusService
    ) {}

    /** Load first page on first open */
    public onToggleClick(
        node: FoodNode,
        nestedNode: CdkNestedTreeNode<any>
    ): void {
        this.eventBusService
            .getStream(DOCUMENT_CLICK_EVENT)
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
