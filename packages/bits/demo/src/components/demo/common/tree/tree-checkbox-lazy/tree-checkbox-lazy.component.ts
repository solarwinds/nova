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

import { ArrayDataSource, SelectionModel } from "@angular/cdk/collections";
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
    ViewChild,
} from "@angular/core";
import { Observable, of } from "rxjs";
import { delay } from "rxjs/operators";

import { expand } from "@nova-ui/bits";

interface ServerNode {
    name: string;
    children?: ServerNode[];
    length?: number;
    isLoading?: boolean;
}

const TREE_DATA: ServerNode[] = [
    {
        name: "Servers",
        children: [],
        length: 3,
        isLoading: false,
    },
];

@Injectable()
export class HttpMock {
    get(): Observable<ServerNode[]> {
        const res = {
            servers: [
                {
                    name: "Microsoft Server",
                    children: [],
                    length: 3,
                    load: "ms-servers",
                },
                {
                    name: "Apache Tomcat",
                    children: [
                        { name: "Version 1" },
                        {
                            name: "Version 2",
                            children: [],
                            load: "apache-version-2",
                            length: 3,
                        },
                        { name: "Version 3" },
                    ],
                    length: 3,
                    isLoading: false,
                },
                { name: "nginx" },
            ],
            "apache-version-2": [
                { name: "1.0.5" },
                { name: "2.1.4" },
                { name: "8.9.0" },
            ],
            "ms-servers": [
                { name: "2019" },
                { name: "2017" },
                { name: "2013" },
            ],
        };
        return of(res as any).pipe(delay(3000));
    }
}

@Component({
    selector: "nui-tree-checkbox-lazy",
    templateUrl: "./tree-checkbox-lazy.component.html",
    styleUrls: ["./tree-checkbox-lazy.component.less"],
    animations: [expand],
    providers: [HttpMock],
})
export class TreeCheckboxLazyComponent {
    public selectionModel = new SelectionModel<ServerNode>(true);
    treeControl = new NestedTreeControl<ServerNode>((node) => node.children);
    dataSource = new ArrayDataSource(TREE_DATA);

    @ViewChild(CdkTree) private cdkTree: CdkTree<ServerNode>;

    hasChild = (_: number, node: ServerNode) => node.length;

    constructor(private http: HttpMock, private differ: IterableDiffers) {}

    loadMore(node: any, nestedNode: CdkNestedTreeNode<any>): void {
        const differ: IterableDiffer<ServerNode> = this.differ
            .find(node.children)
            .create();

        if (node.children?.length === node.length || node.isLoading) {
            return;
        }

        node.isLoading = true;

        this.http.get().subscribe((res: any) => {
            node.isLoading = false;
            node?.load
                ? (node.children = res[node?.load])
                : (node.children = res.servers);
            this.cdkTree.renderNodeChanges(
                node.children,
                differ,
                nestedNode.nodeOutlet.first.viewContainer,
                node
            );
        });
    }

    public descendantsAllSelected(node: ServerNode): boolean {
        const descendants = this.treeControl.getDescendants(node);
        return (
            descendants.length > 0 &&
            descendants.every((child) => this.selectionModel.isSelected(child))
        );
    }

    public descendantsPartiallySelected(node: ServerNode): boolean {
        const descendants = this.treeControl.getDescendants(node);
        const result = descendants.some((child) =>
            this.selectionModel.isSelected(child)
        );
        return result && !this.descendantsAllSelected(node);
    }

    public branchItemSelectionToggle(node: ServerNode): void {
        this.selectionModel.toggle(node);
        const descendants = this.treeControl.getDescendants(node);
        this.selectionModel.isSelected(node)
            ? this.selectionModel.select(...descendants)
            : this.selectionModel.deselect(...descendants);

        descendants.forEach((child) => {
            this.selectionModel.isSelected(child);
        });
        this.checkAllParentsSelection(node);
    }

    public leafItemSelectionToggle(node: ServerNode): void {
        this.selectionModel.toggle(node);
        this.checkAllParentsSelection(node);
    }

    public isParentNodeCheckedOn(node: ServerNode) {
        if (
            this.selectionModel.isSelected(<ServerNode>this.getParentNode(node))
        ) {
            this.selectionModel.select(node);
        }
        return this.selectionModel.isSelected(node);
    }

    private checkAllParentsSelection(node: ServerNode): void {
        let parent: ServerNode | undefined = this.getParentNode(node);
        while (parent) {
            this.checkRootNodeSelection(parent);
            parent = this.getParentNode(parent);
        }
    }

    private checkRootNodeSelection(node: ServerNode): void {
        const nodeSelected = this.selectionModel.isSelected(node);
        const descendants = this.treeControl.getDescendants(node);
        const descAllSelected =
            descendants.length > 0 &&
            descendants.every((child) => this.selectionModel.isSelected(child));
        if (nodeSelected && !descAllSelected) {
            this.selectionModel.deselect(node);
        } else if (!nodeSelected && descAllSelected) {
            this.selectionModel.select(node);
        }
    }

    private getParentNode(node: ServerNode): ServerNode | undefined {
        let parent: ServerNode | undefined;

        if (TREE_DATA.find((n) => n === node)) {
            return;
        }

        const search = (n: ServerNode): ServerNode | undefined => {
            if (parent || !n.children) {
                return;
            }
            if (n.children.find((i) => i === node)) {
                parent = n;
                return;
            }
            return n.children.find(search);
        };

        TREE_DATA.forEach(search);

        if (!parent) {
            throw new Error("Parent wasn't found");
        }

        return parent;
    }
}
