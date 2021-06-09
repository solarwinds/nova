import { browser } from "protractor";

import { Atom } from "../../atom";
import { Helpers } from "../../helpers";
import { Camera } from "../../virtual-camera/Camera";
import { ButtonAtom } from "../button/button.atom";
import { PaginatorAtom } from "../paginator/paginator.atom";
import { SelectV2Atom } from "../select-v2/select-v2.atom";

const name: string = "Paginator";

describe(`Visual tests: ${name}`, () => {
    let camera: Camera;
    let basicPaginator: PaginatorAtom;
    let adjacentPaginator: PaginatorAtom;
    let customPaginator: PaginatorAtom;
    let customStylingPaginator: PaginatorAtom;
    let virtualScrollPaginator: PaginatorAtom;
    let selectBasicPaginator: SelectV2Atom;
    let selectCustomPaginator: SelectV2Atom;
    let selectVirtualScrollPaginator: SelectV2Atom;
    let dotsBasicButton: ButtonAtom;
    let dotsCustomStylingButton: ButtonAtom;

    beforeAll(async () => {
        await Helpers.prepareBrowser("paginator/paginator-visual-test");
        basicPaginator = Atom.find(PaginatorAtom, "nui-visual-test-basic-paginator");
        adjacentPaginator = Atom.find(PaginatorAtom, "nui-visual-test-adjacent-paginator");
        customPaginator = Atom.find(PaginatorAtom, "nui-visual-test-custom-page-set-paginator");
        customStylingPaginator = Atom.find(PaginatorAtom, "nui-visual-test-paginator-styling");
        virtualScrollPaginator = Atom.find(PaginatorAtom, "nui-demo-custom-page-size-set-paginator");
        selectBasicPaginator = Atom.findIn(SelectV2Atom, basicPaginator.getElement());
        selectCustomPaginator = Atom.findIn(SelectV2Atom, customPaginator.getElement());
        selectVirtualScrollPaginator = Atom.findIn(SelectV2Atom, virtualScrollPaginator.getElement());
        dotsBasicButton = Atom.findIn(ButtonAtom, customPaginator.ellipsisLink(0));
        dotsCustomStylingButton = Atom.findIn(ButtonAtom, customStylingPaginator.ellipsisLink(1));
        
        camera = new Camera().loadFilm(browser, name);
    });

    it(`${name} visual test`, async () => {
        await camera.turn.on();
        await camera.say.cheese(`Default`);

        await adjacentPaginator.ellipsisLink(0).click();
        await adjacentPaginator.ellipsedPageLinkClick(35);
        await selectBasicPaginator.toggle();
        await dotsBasicButton.hover();
        await camera.say.cheese(`Menu is toggled and button is hovered`);

        await selectCustomPaginator.toggle();
        await dotsCustomStylingButton.hover();
        await camera.say.cheese(`Menu with custom pageSizeSet is toggled and button is hovered`);

        await customStylingPaginator.ellipsisLink(1).click();
        await camera.say.cheese(`Paginator's ellipsis-pages are shown`);
        await selectBasicPaginator.toggle();
        
        await virtualScrollPaginator.ellipsisLink(1).click();
        await camera.say.cheese(`Paginator with virtual scroll is shown`);
        await selectVirtualScrollPaginator.toggle();

        await Helpers.switchDarkTheme("on");
        await camera.say.cheese(`Dark theme`);

        await camera.turn.off();
    }, 100000);
});
