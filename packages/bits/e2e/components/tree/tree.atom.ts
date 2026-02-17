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
import { expect, test, Helpers } from "../../setup";

export class TreeAtom extends Atom {
    public static CSS_CLASS = "cdk-tree";
    private static NESTED_NODE_TAG = "cdk-nested-tree-node";

    public getNestedNodes(context?: Locator, onlyBranches: boolean = false): Locator {
        if (onlyBranches) {
            return (context ?? this.getLocator()).locator(
                `${TreeAtom.NESTED_NODE_TAG}:not(.nui-tree__leaf)`
            );
        } else{
            return (context ?? this.getLocator()).locator(
            TreeAtom.NESTED_NODE_TAG
        );
        }
    }

    public get visibleNodes(): Locator {
        return this.getLocator().locator(
            `${TreeAtom.NESTED_NODE_TAG}:visible`
        );
    }

    public get branchCheckboxNodes(): Locator {
        return this.getLocator().locator(".branch-control");
    }

    public get leafCheckboxNodes(): Locator {
        return this.getLocator().locator(".leaf-control");
    }

    public getAllHeaders(context?: Locator): Locator {
        return (context ?? this.getLocator()).locator(
            "[cdkTreeNodeToggle]"
        );
    }

    public getNodesByName(name: string): Locator {
        return this.getNestedNodes().filter({ hasText: name });
    }

    private get collapsedExpanders(): Locator {
        return this.getLocator().locator(
            "cdk-nested-tree-node[aria-expanded=false] .nui-tree__header"
        );
    }

    public async expandAll(context?: Locator): Promise<void> {
        await test.step("Expand all tree nodes", async () => {
            const nodes = this.getNestedNodes(context, true);
            const count = await nodes.count();
            for (let i = 0; i < count; i++) {
                const node = nodes.nth(i);
                const visible = await node.isVisible();
                if (!visible) {
                    continue;
                }
                const ariaExpanded = await node.getAttribute("aria-expanded");
                const expanded = ariaExpanded === "true";
                if (!expanded) {
                    await node.click();
                    await this.getNestedNodes(node).first().waitFor({ state: "visible" });
                    await this.expandAll(node);
                }
            }
        });
    }

    public async expandLevel(): Promise<void> {
        const count = await this.collapsedExpanders.count();
        for (let i = 0; i < count; i++) {
            const expander = this.collapsedExpanders.nth(i);
            if (await expander.isVisible()) {
                await expander.click();
            }
        }
    }

    public async toHaveVisibleNodesCount(expected: number): Promise<void> {
        await expect(
            this.getLocator().locator(
                `${TreeAtom.NESTED_NODE_TAG}:visible`
            )
        ).toHaveCount(expected);
    }

    public async toBeExpanded(node: Locator): Promise<void> {
        await expect(node).toHaveAttribute("aria-expanded", "true");
    }

    public async toBeCollapsed(node: Locator): Promise<void> {
        await expect(node).toHaveAttribute("aria-expanded", "false");
    }

    public async toHaveBranchCheckboxCount(expected: number): Promise<void> {
        await expect(this.branchCheckboxNodes).toHaveCount(expected);
    }

    public async toHaveLeafCheckboxCount(expected: number): Promise<void> {
        await expect(this.leafCheckboxNodes).toHaveCount(expected);
    }
}
