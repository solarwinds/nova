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
                page: 1,
                hasPagination: true,
            },
            {
                name: "Fruits",
                children: [],
                page: 1,
                hasPagination: true,
            },
        ],
    },
];

@Component({
    selector: "nui-tree-load-more-example",
    templateUrl: "./tree-load-more.example.component.html",
    styleUrls: ["./tree-load-more.component.example.less"],
    animations: [expand],
    providers: [HttpMockService],
})
export class TreeLoadMoreExampleComponent {
    public pageSize = 10;
    public remainingItemsCount: { [key: string]: number } = {};

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
            node.page = 1;
            this.loadMoreItems(node, nestedNode);
        }
    }

    public loadMoreItems(
        node: FoodNode,
        nestedNodeDirective: CdkNestedTreeNode<any>
    ): void {
        if (node.isLoading) {
            return;
        }

        node.isLoading = true;

        const page = node.page ? node.page++ : 1;

        this.http
            .getNodeItems(node.name, page, this.pageSize)
            .subscribe((res: IApiResponse) => {
                this.setRemainingItemsCount(node, res.total);
                this.handleNodeContent(node, nestedNodeDirective, res.items);
                node.isLoading = false;
            });
    }

    private setRemainingItemsCount(node: FoodNode, totalItems: number) {
        this.remainingItemsCount[node.name] = node.children
            ? totalItems - node.children?.length
            : totalItems;
    }

    private handleNodeContent(
        node: FoodNode,
        nestedNodeDirective: CdkNestedTreeNode<any>,
        items: FoodNode[]
    ) {
        const differ: IterableDiffer<FoodNode> = this.differ
            .find(node.children)
            .create();
        node.children?.push(...items);

        // clear previously rendered leaf nodes
        nestedNodeDirective.nodeOutlet.first.viewContainer.clear();
        this.cdkTree.renderNodeChanges(
            node.children || [],
            differ,
            nestedNodeDirective.nodeOutlet.first.viewContainer,
            node
        );
    }
}
