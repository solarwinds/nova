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

import { browser, ElementFinder, ExpectedConditions as EC } from "protractor";

import { TreeAtom } from "./tree.atom";
import { Atom } from "../../atom";
import { Animations, Helpers } from "../../helpers";
import { Camera } from "../../virtual-camera/Camera";
import { PaginatorAtom } from "../paginator/paginator.atom";

const name: string = "Tree";

describe(`Visual tests: ${name}`, () => {
    let camera: Camera;
    let basicTree: TreeAtom;
    let checkboxTree: TreeAtom;
    let paginatorTree: TreeAtom;
    let paginator1: PaginatorAtom;
    let paginator2: PaginatorAtom;

    beforeAll(async () => {
        await Helpers.prepareBrowser("common/tree/tree-visual-test");
        await Helpers.disableCSSAnimations(Animations.ALL);

        basicTree = Atom.find(TreeAtom, "nui-tree-basic-example");
        checkboxTree = Atom.find(TreeAtom, "nui-tree-checkbox-example");
        paginatorTree = Atom.find(TreeAtom, "nui-tree-paginator-example");
        paginator1 = Atom.find(
            PaginatorAtom,
            "nui-tree-paginator-component-vegetables"
        );
        paginator2 = Atom.find(
            PaginatorAtom,
            "nui-tree-paginator-component-fruits"
        );

        camera = new Camera().loadFilm(browser, name);
    });

    it(`${name} visual test`, async () => {
        await camera.turn.on();

        await paginatorTree.expandAll();
        await browser.wait(
            EC.visibilityOf(paginator1.getElement()) &&
                EC.visibilityOf(paginator2.getElement()),
            3000,
            "Paginators didn't load!"
        );
        await paginator2.ellipsisLink(0).click();
        await camera.say.cheese("Default");

        await paginatorTree.getAllHeaders().last().click();
        await basicTree.expandAll();
        await checkboxTree.expandAll();
        await Helpers.clickOnEmptySpace();
        await camera.say.cheese("Tree is fully opened up");

        await checkboxTree
            .getBranchCheckboxNodes()
            .each(
                async (
                    item: ElementFinder | undefined,
                    index: number | undefined
                ) => {
                    if (index) {
                        await item?.click();
                    }
                }
            );
        await browser.wait(
            EC.visibilityOf(checkboxTree.getLeafCheckboxNodes().first()),
            3000,
            "Can't see the first leaf checkbox node!"
        );
        await checkboxTree.getLeafCheckboxNodes().first().click();
        await camera.say.cheese("Checkbox Tree is in all possible states");

        await Helpers.switchDarkTheme("on");
        await camera.say.cheese("Dark theme");

        await camera.turn.off();
    }, 100000);
});
