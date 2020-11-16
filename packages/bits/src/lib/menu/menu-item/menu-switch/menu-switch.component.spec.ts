import { MockedChangeDetectorRef } from "../../../../spec-helpers/angular";
import { MenuGroupComponent } from "../menu-group/menu-group.component";

import { MenuSwitchComponent } from "./menu-switch.component";

describe("components >", () => {

    describe("menu-switch >", () => {

        describe("stopPropagationOfClick function >", () => {
            let mockEvent: MouseEvent;
            let spyForSwitchEmit: jasmine.Spy;
            let menuSwitch: MenuSwitchComponent;

            beforeEach(() => {
                mockEvent = jasmine.createSpyObj("event", ["preventDefault", "stopPropagation"]);
                menuSwitch = new MenuSwitchComponent(new MenuGroupComponent(), new MockedChangeDetectorRef());
                spyForSwitchEmit = spyOn(menuSwitch.actionDone, "emit");
            });

            it(`should prevent default behavior, stop propagation of click event and not emit if disabled`, () => {
                menuSwitch.disabled = true;
                menuSwitch.stopPropagationOfClick(mockEvent);

                expect(mockEvent.preventDefault).not.toHaveBeenCalled();
                expect(mockEvent.stopPropagation).toHaveBeenCalled();
                expect(spyForSwitchEmit).not.toHaveBeenCalled();
            });

            it(`should prevent default behavior, not stop propagation and emit if not disabled`, () => {
                menuSwitch.disabled = false;
                menuSwitch.stopPropagationOfClick(mockEvent);

                expect(mockEvent.preventDefault).toHaveBeenCalled();
                expect(mockEvent.stopPropagation).toHaveBeenCalled();
                expect(spyForSwitchEmit).toHaveBeenCalledWith(true);
            });

        });

    });

});
