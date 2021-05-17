import { ArrayDataSource, SelectionModel } from "@angular/cdk/collections";
import { NestedTreeControl } from "@angular/cdk/tree";
import { Component } from "@angular/core";
import { expand } from "@nova-ui/bits";

import {FoodNode, TREE_DATA_CHECKBOX} from "../data";

@Component({
    selector: "nui-tree-checkbox-test",
    templateUrl: "./tree-checkbox-test.component.html",
    styleUrls: ["./tree-checkbox-test.component.less"],
    host: { id: "nui-tree-checkbox-example" },
    animations: [expand],
})

export class TreeCheckboxTestComponent {
    public treeControl = new NestedTreeControl<FoodNode>((node) => node.children);
    public dataSource = new ArrayDataSource(TREE_DATA_CHECKBOX);
    public selectionModel = new SelectionModel<FoodNode>(true);

    public hasChild = (_: number, node: FoodNode) => !!node.children && node.children.length > 0;

    /** Whether all the descendants of the node are selected. */
    public descendantsAllSelected(node: FoodNode): boolean {
        const descendants = this.treeControl.getDescendants(node);
        return descendants.length > 0 && descendants.every(child => this.selectionModel.isSelected(child));
    }

    /** Whether part of the descendants are selected */
    public descendantsPartiallySelected(node: FoodNode): boolean {
        const descendants = this.treeControl.getDescendants(node);
        const result = descendants.some(child => this.selectionModel.isSelected(child));
        return result && !this.descendantsAllSelected(node);
    }

    /** Toggle the branch selection. Select/deselect all the descendants node */
    public branchItemSelectionToggle(node: FoodNode): void {
        this.selectionModel.toggle(node);
        const descendants = this.treeControl.getDescendants(node);
        this.selectionModel.isSelected(node)
            ? this.selectionModel.select(...descendants)
            : this.selectionModel.deselect(...descendants);

        // Force update for the parent
        descendants.forEach(child => this.selectionModel.isSelected(child));
        this.checkAllParentsSelection(node);
    }

    /** Toggle a leaf item selection. Check all the parents to see if they changed */
    public leafItemSelectionToggle(node: FoodNode): void {
        this.selectionModel.toggle(node);
        this.checkAllParentsSelection(node);
    }

    /** Checks all the parents when a leaf node is selected/unselected */
    private checkAllParentsSelection(node: FoodNode): void {
        let parent: FoodNode | undefined = this.getParentNode(node);
        while (parent) {
            this.checkRootNodeSelection(parent);
            parent = this.getParentNode(parent);
        }
    }

    /** Check root node checked state and change it accordingly */
    private checkRootNodeSelection(node: FoodNode): void {
        const nodeSelected = this.selectionModel.isSelected(node);
        const descendants = this.treeControl.getDescendants(node);
        const descAllSelected = descendants.length > 0 && descendants.every(child => this.selectionModel.isSelected(child));
        if (nodeSelected && !descAllSelected) {
            this.selectionModel.deselect(node);
        } else if (!nodeSelected && descAllSelected) {
            this.selectionModel.select(node);
        }
    }

    /** Get the parent node of a node */
    private getParentNode(node: FoodNode): FoodNode | undefined {
        let parent: FoodNode | undefined;

        // Don't need to get parent if node on the 0 level
        if (TREE_DATA_CHECKBOX.find(n => n === node)) {
            return;
        }

        const search = (n: FoodNode): FoodNode | undefined => {
            if (parent || !n.children) {
                return;
            }
            if (n.children.find(i => i === node)) {
                parent = n;
                return;
            }
            return n.children.find(search);
        };

        // invoke search on the level 0 items
        TREE_DATA_CHECKBOX.forEach(search);

        if (!parent) {
            throw new Error("Parent wasn't found");
        }

        return parent;
    }
}
