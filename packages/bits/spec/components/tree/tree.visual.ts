import { browser, ElementFinder, ExpectedConditions as EC } from "protractor";

import { Atom } from "../../atom";
import { Animations, Helpers } from "../../helpers";
import { PaginatorAtom } from "../paginator/paginator.atom";

import { TreeAtom } from "./tree.atom";

describe("Visual tests: Tree", () => {
    // Add typings and use Eyes class instead of any in scope of <NUI-5428>
    let eyes: any;
    let basicTree: TreeAtom;
    let checkboxTree: TreeAtom;
    let paginatorTree: TreeAtom;
    let paginator1: PaginatorAtom;
    let paginator2: PaginatorAtom;

    beforeAll(async () => {
        eyes = await Helpers.prepareEyes();
        await Helpers.prepareBrowser("common/tree/tree-visual-test");
        await Helpers.disableCSSAnimations(Animations.ALL);

        basicTree = Atom.find(TreeAtom, "nui-tree-basic-example");
        checkboxTree = Atom.find(TreeAtom, "nui-tree-checkbox-example");
        paginatorTree = Atom.find(TreeAtom, "nui-tree-paginator-example");
        paginator1 = Atom.find(PaginatorAtom, "nui-tree-paginator-component-vegetables");
        paginator2 = Atom.find(PaginatorAtom, "nui-tree-paginator-component-fruits");
    });

    afterAll(async () => {
        await eyes.abortIfNotClosed();
    });

    it("Default look", async () => {
        await eyes.open(browser, "NUI", "Tree");
        await paginatorTree.expandAll();
        await browser.wait(
                EC.visibilityOf(paginator1.getElement()) &&
                EC.visibilityOf(paginator2.getElement()), 3000, "Paginators didn't load!");
        await paginator2.ellipsisLink(0).click();
        await eyes.checkWindow("Default");

        await paginatorTree.getAllHeaders().last().click();
        await basicTree.expandAll();
        await checkboxTree.expandAll();
        await Helpers.clickOnEmptySpace();
        await eyes.checkWindow("Tree is fully opened up");


        await checkboxTree.getBranchCheckboxNodes().each(async (item: ElementFinder | undefined, index: number | undefined) => {
           if (index) {
                await item?.click();
           }
        });
        await browser.wait(EC.visibilityOf(checkboxTree.getLeafCheckboxNodes().first()), 3000, "Can't see the first leaf checkbox node!");
        await checkboxTree.getLeafCheckboxNodes().first().click();
        await eyes.checkWindow("Checkbox Tree is in all possible states");

        await Helpers.switchDarkTheme("on");
        await eyes.checkWindow("Dark theme");

        await eyes.close();
    }, 100000);
});
