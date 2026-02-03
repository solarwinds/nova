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

import { Locator } from "playwright-core";

import { Atom } from "../../atom";
import { expect } from "../../setup";

export class TreeAtom extends Atom {
    public static CSS_CLASS = "cdk-tree";
    private static NESTED_NODE_TAG = "cdk-nested-tree-node";

    // --- Locator getters ---

    /** All nested tree nodes within a context (default: root). */
    public getNestedNodes(context?: Locator): Locator {
        return (context ?? this.getLocator()).locator(
            TreeAtom.NESTED_NODE_TAG
        );
    }

    /** Visible nested tree nodes. */
    public get visibleNodes(): Locator {
        return this.getLocator().locator(
            `${TreeAtom.NESTED_NODE_TAG}:visible`
        );
    }

    /** Branch checkbox nodes. */
    public get branchCheckboxNodes(): Locator {
        return this.getLocator().locator(".branch-control");
    }

    /** Leaf checkbox nodes. */
    public get leafCheckboxNodes(): Locator {
        return this.getLocator().locator(".leaf-control");
    }

    /** All header toggles in a context. */
    public getAllHeaders(context?: Locator): Locator {
        return (context ?? this.getLocator()).locator(
            "[cdkTreeNodeToggle]"
        );
    }

    /** Nodes filtered by text content. */
    public getNodesByName(name: string): Locator {
        return this.getNestedNodes().filter({ hasText: name });
    }

    /** Collapsed expander headers. */
    private get collapsedExpanders(): Locator {
        return this.getLocator().locator(
            "cdk-nested-tree-node[aria-expanded=false] .nui-tree__header"
        );
    }

    // --- Actions ---

    /** Expand all nodes recursively starting from a context. */
    public async expandAll(context?: Locator): Promise<void> {
        const nodes = this.getNestedNodes(context);
        const count = await nodes.count();
        for (let i = 0; i < count; i++) {
            const node = nodes.nth(i);
            if (!(await node.isVisible())) {
                continue;
            }
            const expanded =
                (await node.getAttribute("aria-expanded")) === "true";
            if (!expanded) {
                await node.click();
                await this.expandAll(node);
            }
        }
    }

    /** Expand one level of currently collapsed nodes. */
    public async expandLevel(): Promise<void> {
        const count = await this.collapsedExpanders.count();
        for (let i = 0; i < count; i++) {
            const expander = this.collapsedExpanders.nth(i);
            if (await expander.isVisible()) {
                await expander.click();
            }
        }
    }

    // --- Retryable assertions ---

    /** Assert the number of visible nested nodes. */
    public async toHaveVisibleNodesCount(expected: number): Promise<void> {
        await expect(
            this.getLocator().locator(
                `${TreeAtom.NESTED_NODE_TAG}:visible`
            )
        ).toHaveCount(expected);
    }

    /** Assert a node is expanded. */
    public async toBeExpanded(node: Locator): Promise<void> {
        await expect(node).toHaveAttribute("aria-expanded", "true");
    }

    /** Assert a node is collapsed. */
    public async toBeCollapsed(node: Locator): Promise<void> {
        await expect(node).toHaveAttribute("aria-expanded", "false");
    }

    /** Assert branch checkbox count. */
    public async toHaveBranchCheckboxCount(expected: number): Promise<void> {
        await expect(this.branchCheckboxNodes).toHaveCount(expected);
    }

    /** Assert leaf checkbox count. */
    public async toHaveLeafCheckboxCount(expected: number): Promise<void> {
        await expect(this.leafCheckboxNodes).toHaveCount(expected);
    }
}
