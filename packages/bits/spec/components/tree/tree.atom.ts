import {by, ElementArrayFinder, ElementFinder} from "protractor";

import { Atom } from "../../atom";

export class TreeAtom extends Atom {
    public static CSS_CLASS = "cdk-tree";
    public static NESTED_NODE_TAG = "cdk-nested-tree-node";

    public root: ElementFinder = this.getElement();

    public async getNestedNodes(el: ElementFinder = this.root): Promise<ElementFinder[]> {
        return await this.getAllNestedNodes(el)
                         .reduce(async (acc: ElementFinder[], item: ElementFinder) =>
                                        await item.isDisplayed() ? acc.concat(item) : acc, []);
    }

    public async isExpanded(el: ElementFinder): Promise<boolean> {
        return await el.getAttribute("aria-expanded") === "true";
    }

    public async getNodesByName(name: string): Promise<ElementFinder[]> {
        return this.getAllNestedNodes()
                   .filter(async item => (await item.getText()) === name);
    }

    public async expandAll(el: ElementFinder = this.root) {
        for (const expander of (await this.getNestedNodes(el))) {
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

    public expandLevel = async () => {
        this.getCollapsedExpanders().each(async (i: ElementFinder | undefined) => {
            const displayed = await i?.isDisplayed();
            if (displayed) {
                await i?.click();
            }
        });
    }

    public getBranchCheckboxNodes(): ElementArrayFinder {
        return this.root.all(by.css(".branch-control"));
    }

    public getLeafCheckboxNodes(): ElementArrayFinder {
        return this.root.all(by.css(".leaf-control"));
    }

    public getAllHeaders(context: ElementFinder = this.root): ElementArrayFinder {
        return context.all(by.css("[cdkTreeNodeToggle]"));
    }
    private getAllNestedNodes(context: ElementFinder = this.root): ElementArrayFinder {
        return context.all(by.tagName(TreeAtom.NESTED_NODE_TAG));
    }

    private getCollapsedExpanders = () => this.root.all(by.css("cdk-nested-tree-node[aria-expanded=false] .nui-tree__header"));
}
