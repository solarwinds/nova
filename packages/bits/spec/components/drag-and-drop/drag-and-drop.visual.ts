import { browser, by, element } from "protractor";

import { Atom } from "../../atom";
import { Helpers } from "../../helpers";

import { CdkDraggableItemAtom } from "./cdk-drop-item.atom";
import { CdkDropListAtom } from "./cdk-drop-list.atom";

// The test is flacky. Disabling it until a solution is found in scope of NUI-4659
xdescribe("Drag and Drop", () => {
    // Add typings and use Eyes class instead of any in scope of <NUI-5428>
    let eyes: any;

    let dragListFirstItem: CdkDraggableItemAtom;
    let dragListSecondItem: CdkDraggableItemAtom;

    let dragList: CdkDropListAtom;
    let dropList: CdkDropListAtom;

    beforeEach(async () => {
        eyes = await Helpers.prepareEyes();

        await Helpers.prepareBrowser("external-libraries/drag-and-drop/dropzone-visual");
        dragList = Atom.findIn(CdkDropListAtom, element(by.id("nui-demo-drop-list-1")));
        dropList = Atom.findIn(CdkDropListAtom, element(by.id("nui-demo-drop-list-2")));

        dragListFirstItem = await dragList.getItem(0);
        dragListSecondItem = await dragList.getItem(1);

    });

    afterAll(async () => {
        await eyes.abortIfNotClosed();
    });

    xit("Drop target", async () => {
        await eyes.open(browser, "NUI", "Drag and Drop Placeholder");

        // SC1: Checking drag preview
        await dragListFirstItem.hover();
        await eyes.checkWindow("CDK drag preview should appear");


        // SC2: Dragging an item to be able to see the drop container highlight
        await dragListFirstItem.dragSelf({x: 5, y: 0});
        await eyes.checkWindow("Drop target should be highlighted");
        await dragListFirstItem.mouseUp();


        // SC3: Dragging accepted item into the drop container
        await dragListFirstItem.dragTo(dropList.getElement(), {x: 0, y: 50});
        await eyes.checkWindow("Drop target should be highlighted with green");
        await dragListFirstItem.mouseUp();


        // SC4: Dragging rejected item into the drop container
        await dragListSecondItem.hover();
        // Using two move actions to let the container catch the mouse event,
        // otherwise it looks more like a teleport
        await dragListSecondItem.dragTo(dropList.getElement(), {x: 0, y: 50});
        await dragListSecondItem.move(dropList.getElement());
        await eyes.checkWindow("Drop target should be highlighted with red");
        await dragListFirstItem.mouseUp();


        await eyes.close();
    }, 100000);
});
