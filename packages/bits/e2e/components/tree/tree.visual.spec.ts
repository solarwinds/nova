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

import { TreeAtom } from "./tree.atom";
import { Atom } from "../../atom";
import { Animations, expect, Helpers, test } from "../../setup";
import { Camera } from "../../virtual-camera/Camera";
import { PaginatorAtom } from "../paginator/paginator.atom";

const name: string = "Tree";

test.describe(`Visual tests: ${name}`, () => {
    let basicTree: TreeAtom;
    let checkboxTree: TreeAtom;
    let paginatorTree: TreeAtom;
    let paginator1: PaginatorAtom;
    let paginator2: PaginatorAtom;

    test.beforeEach(async ({ page }) => {
        await Helpers.prepareBrowser("common/tree/tree-visual-test", page);
        await Helpers.disableCSSAnimations(Animations.ALL);

        basicTree = Atom.find<TreeAtom>(TreeAtom, "nui-tree-basic-example");
        checkboxTree = Atom.find<TreeAtom>(TreeAtom, "nui-tree-checkbox-example");
        paginatorTree = Atom.find<TreeAtom>(TreeAtom, "nui-tree-paginator-example");
        paginator1 = Atom.find<PaginatorAtom>(
            PaginatorAtom,
            "nui-tree-paginator-component-vegetables"
        );
        paginator2 = Atom.find<PaginatorAtom>(
            PaginatorAtom,
            "nui-tree-paginator-component-fruits"
        );
    });

    test(`${name} visual test`, async ({ page }) => {
        const camera = new Camera().loadFilm(page, name, "Bits");
        await camera.turn.on();
        await paginatorTree.toBeVisible();
        await paginatorTree.expandAll();
        await paginator1.toBeVisible();
        await paginator2.toBeVisible();
        await paginator2.ellipsisLink(0).click();
        await camera.say.cheese("Default");

        await paginatorTree.getAllHeaders().last().click();
        await basicTree.expandAll();
        await checkboxTree.expandAll();
        await Helpers.clickOnEmptySpace();
        await camera.say.cheese("Tree is fully opened up");

        const branchCheckboxes = checkboxTree.branchCheckboxNodes;
        const count = await branchCheckboxes.count();
        for (let i = 1; i < count; i++) {
            await branchCheckboxes.nth(i).click();
        }
        await expect(checkboxTree.leafCheckboxNodes.first()).toBeVisible();
        await checkboxTree.leafCheckboxNodes.first().click();
        await camera.say.cheese("Checkbox Tree is in all possible states");

        await Helpers.switchDarkTheme("on");
        await camera.say.cheese("Dark theme");

        await camera.turn.off();
    });
});
