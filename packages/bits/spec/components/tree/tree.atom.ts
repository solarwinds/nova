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

import { by, ElementArrayFinder, ElementFinder } from "protractor";

import { Atom } from "../../atom";

export class TreeAtom extends Atom {
    public static CSS_CLASS = "cdk-tree";
    public static NESTED_NODE_TAG = "cdk-nested-tree-node";

    public root: ElementFinder = this.getElement();

    public async getNestedNodes(
        el: ElementFinder = this.root
    ): Promise<ElementFinder[]> {
        return await this.getAllNestedNodes(el).reduce(
            async (acc: ElementFinder[], item: ElementFinder) =>
                (await item.isDisplayed()) ? acc.concat(item) : acc,
            []
        );
    }

    public async isExpanded(el: ElementFinder): Promise<boolean> {
        return (await el.getAttribute("aria-expanded")) === "true";
    }

    public async getNodesByName(name: string): Promise<ElementFinder[]> {
        return this.getAllNestedNodes().filter(
            async (item) => (await item.getText()) === name
        );
    }

    public async expandAll(el: ElementFinder = this.root): Promise<void> {
        for (const expander of await this.getNestedNodes(el)) {
            const expanded = await this.isExpanded(expander);
            if (!expanded) {
                await expander.click();
                const nestedNodes = await this.getNestedNodes(expander);
                if (nestedNodes.length > 0) {
                    await this.expandAll(expander);
                }
            }
        }
    }

    public async expandLevel(): Promise<void> {
        await this.getCollapsedExpanders().each(
            async (i: ElementFinder | undefined) => {
                const displayed = await i?.isDisplayed();
                if (displayed) {
                    await i?.click();
                }
            }
        );
    }

    public getBranchCheckboxNodes(): ElementArrayFinder {
        return this.root.all(by.css(".branch-control"));
    }

    public getLeafCheckboxNodes(): ElementArrayFinder {
        return this.root.all(by.css(".leaf-control"));
    }

    public getAllHeaders(
        context: ElementFinder = this.root
    ): ElementArrayFinder {
        return context.all(by.css("[cdkTreeNodeToggle]"));
    }
    private getAllNestedNodes(
        context: ElementFinder = this.root
    ): ElementArrayFinder {
        return context.all(by.tagName(TreeAtom.NESTED_NODE_TAG));
    }

    private getCollapsedExpanders = () =>
        this.root.all(
            by.css(
                "cdk-nested-tree-node[aria-expanded=false] .nui-tree__header"
            )
        );
}
