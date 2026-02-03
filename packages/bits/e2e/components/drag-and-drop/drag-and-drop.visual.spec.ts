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

import { CdkDraggableItemAtom } from "./cdk-drop-item.atom";
import { CdkDropListAtom } from "./cdk-drop-list.atom";
import { Atom } from "../../atom";
import { Animations, Helpers, test } from "../../setup";
import { Camera } from "../../virtual-camera/Camera";

const name = "Drag and Drop";

// The test is flaky. Disabling it until a solution is found in scope of NUI-4659
test.describe.skip(`Visual tests: ${name}`, () => {
    let dragListFirstItem: CdkDraggableItemAtom;
    let dragListSecondItem: CdkDraggableItemAtom;
    let dragList: CdkDropListAtom;
    let dropList: CdkDropListAtom;

    test.beforeEach(async ({ page }) => {
        await Helpers.prepareBrowser(
            "external-libraries/drag-and-drop/dropzone-visual",
            page
        );
        await Helpers.disableCSSAnimations(Animations.ALL);

        dragList = Atom.findIn<CdkDropListAtom>(
            CdkDropListAtom,
            page.locator("#nui-demo-drop-list-1")
        );
        dropList = Atom.findIn<CdkDropListAtom>(
            CdkDropListAtom,
            page.locator("#nui-demo-drop-list-2")
        );

        dragListFirstItem = dragList.getItem(0);
        dragListSecondItem = dragList.getItem(1);
    });

    test.skip("Drop target", async ({ page }) => {
        const camera = new Camera().loadFilm(page, name, "Bits");
        await camera.turn.on();

        // SC1: Checking drag preview
        await dragListFirstItem.hover();
        await camera.say.cheese("CDK drag preview should appear");

        // SC2: Dragging an item to be able to see the drop container highlight
        await dragListFirstItem.dragSelf({ x: 5, y: 0 });
        await camera.say.cheese("Drop target should be highlighted");
        await dragListFirstItem.mouseUp();

        // SC3: Dragging accepted item into the drop container
        await dragListFirstItem.dragTo(dropList.getLocator(), { x: 0, y: 50 });
        await camera.say.cheese("Drop target should be highlighted with green");
        await dragListFirstItem.mouseUp();

        // SC4: Dragging rejected item into the drop container
        await dragListSecondItem.hover();
        // Using two move actions to let the container catch the mouse event,
        // otherwise it looks more like a teleport
        await dragListSecondItem.dragTo(dropList.getLocator(), { x: 0, y: 50 });
        await dragListSecondItem.move(dropList.getLocator());
        await camera.say.cheese("Drop target should be highlighted with red");
        await dragListFirstItem.mouseUp();

        await camera.turn.off();
    });
});
