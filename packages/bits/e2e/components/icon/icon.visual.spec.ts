import { Atom } from "../../atom";
import { test, Helpers, Animations } from "../../setup";
import { Camera } from "../../virtual-camera/Camera";
import { IconAtom } from "./icon.atom";

const name: string = "Icon";

test.describe(`Visual tests: ${name}`, () => {
    let camera: Camera, iconBasic: IconAtom;

    test.beforeEach(async ({ page }) => {
        await Helpers.prepareBrowser("icon/icon-visual-test", page);
        await Helpers.disableCSSAnimations(Animations.TRANSITIONS_AND_ANIMATIONS);
        iconBasic = Atom.find<IconAtom>(IconAtom, "nui-icon-test-basic-usage");

        camera = new Camera().loadFilm(page, name, "Bits");
    });

    test(`${name} visual test`, async () => {
        await camera.turn.on();

        await camera.say.cheese(`Default`);

        await iconBasic.hover();
        await camera.say.cheese(`Default with hover`);

        await Helpers.switchDarkTheme("on");
        await camera.say.cheese(`Dark theme`);
        await Helpers.switchDarkTheme("off");

        await camera.turn.off();
    });
});
