import { browser } from "protractor";

import { Atom } from "../../atom";
import { Helpers } from "../../helpers";
import { Camera } from "../../virtual-camera/Camera";

import { RadioGroupAtom } from "./radio-group.atom";

const name: string = "Radio Group";

describe(`Visual tests: ${name}`, () => {
    let camera: Camera,
        fruitGroup: RadioGroupAtom,
        vegetableGroup: RadioGroupAtom;

    beforeAll(async () => {
        await Helpers.prepareBrowser("radio-group/radio-group-visual-test");
        fruitGroup = Atom.find(RadioGroupAtom, "fruit-radio-group");
        vegetableGroup = Atom.find(RadioGroupAtom, "vegetable-radio-group");
        
        camera = new Camera().loadFilm(browser, name);
    });

    it(`${name} visual test`, async () => {
        await camera.turn.on();
        await camera.say.cheese(`Default`);

        await fruitGroup.getRadioByValue("Banana").click();
        await fruitGroup.hover(fruitGroup.getRadioByValue("Papaya"));
        await camera.say.cheese(`Click Banana and Hover on Papaya`);

        await Helpers.switchDarkTheme("on");
        await camera.say.cheese(`Dark theme`);
        await Helpers.switchDarkTheme("off");

        await vegetableGroup.hover(vegetableGroup.getRadioByValue("Carrot"));
        await camera.say.cheese(`Disabled Group and Default Value with Form Control`);
 
        await camera.turn.off();
    }, 100000);
});
