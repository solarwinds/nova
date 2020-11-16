import { ArrayDataSource } from "@angular/cdk/collections";
import { CdkNestedTreeNode, CdkTree, NestedTreeControl } from "@angular/cdk/tree";
import { Component, Injectable, IterableDiffer, IterableDiffers, ViewChild } from "@angular/core";
import { expand } from "@solarwinds/nova-bits";
import { Observable, of } from "rxjs";
import { delay } from "rxjs/operators";


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
            {name: "Banana"},
            {
                name: "Fruit",
                children: [],
                length: 3,
                isLoading: false,
            },
            {name: "Fruit loops"},
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
})
export class TreeLazyExampleComponent {

    treeControl = new NestedTreeControl<FoodNode>((node) => node.children);
    dataSource = new ArrayDataSource(TREE_DATA);

    @ViewChild(CdkTree) private cdkTree: CdkTree<FoodNode>;

    hasChild = (_: number, node: FoodNode) => node.length;

    constructor(private http: HttpMock,
                private differ: IterableDiffers) {
    }

    loadMore(node: FoodNode, nestedNode: CdkNestedTreeNode<any>): void {
        const differ: IterableDiffer<FoodNode> = this.differ.find(node.children).create();

        if (node.children?.length === node.length || node.isLoading) {
            return;
        }

        node.isLoading = true;

        this.http.get().subscribe((res: FoodNode[]) => {
            node.isLoading = false;
            node.children = res;
            this.cdkTree.renderNodeChanges(node.children, differ, nestedNode.nodeOutlet.first.viewContainer, node);
        });
    }
}
