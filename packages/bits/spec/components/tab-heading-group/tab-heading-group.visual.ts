import { browser, by, element, ExpectedConditions } from "protractor";

import { Atom } from "../../atom";
import { Animations, Helpers } from "../../helpers";
import { Camera } from "../../virtual-camera/Camera";

import { TabHeadingGroupAtom } from "./tab-heading-group.atom";
import { TabHeadingAtom } from "./tab-heading.atom";

const name: string = "Tab Heading Group";

describe(`Visual tests: ${name}`, () => {
    let camera: Camera;
    let tabGroupHorizontal: TabHeadingGroupAtom;
    let tabGroupWithContent: TabHeadingGroupAtom;
    let tabGroupWithIcons: TabHeadingGroupAtom;
    let tabGroupResponsive: TabHeadingGroupAtom;

    beforeAll(async () => {
        await Helpers.prepareBrowser("tabgroup/tabgroup-test");
        await Helpers.disableCSSAnimations(Animations.ALL);
        tabGroupHorizontal = Atom.findIn(
            TabHeadingGroupAtom,
            element(by.id("nui-demo-visual-tabgroup-horizontal"))
        );
        tabGroupWithContent = Atom.findIn(
            TabHeadingGroupAtom,
            element(by.id("nui-demo-visual-tabgroup-with-content"))
        );
        tabGroupWithIcons = Atom.findIn(
            TabHeadingGroupAtom,
            element(by.id("nui-demo-visual-tabgroup-horizontal-icons"))
        );
        tabGroupResponsive = Atom.findIn(
            TabHeadingGroupAtom,
            element(by.id("nui-demo-visual-tabgroup-responsive"))
        );

        camera = new Camera().loadFilm(browser, name);
    });

    it(`${name} visual test`, async () => {
        await camera.turn.on();

        await (await tabGroupHorizontal.getFirstTab()).hover();
        await camera.say.cheese("Default with hover");

        await tabGroupWithContent
            .getTabs()
            .then(async (tab: TabHeadingAtom[]) => await tab[1].click());
        await tabGroupWithIcons
            .getLastTab()
            .then(async (tab: TabHeadingAtom) => await tab.click());
        await tabGroupWithIcons
            .getFirstTab()
            .then(async (tab: TabHeadingAtom) => await tab.hover());
        await camera.say.cheese("Hover on inactive tab + switching active tab");

        await tabGroupResponsive.clickCaretRight(15);
        /** Waiting for the last tab to appear so we can click it */
        await browser.wait(
            ExpectedConditions.visibilityOf(
                await tabGroupResponsive
                    .getLastTab()
                    .then((tab) => tab.getElement())
            )
        );
        await (await tabGroupResponsive.getLastTab()).click();
        await (await tabGroupResponsive.getLastTab()).hover();
        await camera.say.cheese("Moving through tabs using caret right");

        await Helpers.switchDarkTheme("on");
        await camera.say.cheese(`Dark theme`);

        await camera.turn.off();
    }, 200000);
});
