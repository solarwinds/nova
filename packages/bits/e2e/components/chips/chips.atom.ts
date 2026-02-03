import { Locator } from "playwright-core";

import { Atom } from "../../atom";
import { Helpers } from "../../setup";

export class ChipsAtom extends Atom {
    public static CSS_CLASS = "nui-chips";
    public static qtyLabelClass = "nui-chips__count";
    public static itemClass = "nui-chip__value";
    public static itemRemoveIconClass = "nui-chip__value-remove";
    public static groupNameClass = "nui-chips__group-name";
    public static clearAllLinkClass = "nui-chips__clear";
    public static chipsoverflowedClass = "nui-chips-overflowed__counter";

    public get groups(): Locator {
        return this.getLocator().locator(
            Helpers.page.locator(`.${ChipsAtom.groupNameClass}`)
        );
    }

    public get getChipElements(): Locator {
        return this.getLocator().locator(`.${ChipsAtom.itemClass}`);
    }

    public removeItem = async (index: number): Promise<void> => {
        return this.getLocator()
            .locator(Helpers.page.locator(`.${ChipsAtom.itemRemoveIconClass}`))
            .nth(index)
            .click();
    };

    public clearAll = async (): Promise<void> => {
        await this.getLocator()
            .locator(`.${ChipsAtom.clearAllLinkClass}`)
            .click();
    };

    public async getChipsQuantityFromLabel(): Promise<number> {
        const t = await this.getLocator()
            .locator(`.${ChipsAtom.qtyLabelClass}`)
            .textContent();

        if (!t) {
            return Promise.resolve(-1);
        }
        return +t.slice(1, -1);
    }

    public click = async (): Promise<void> => this.getLocator().click();

    public get getChipsOverflow(): Locator {
        return this.getLocator().locator(
            Helpers.page.locator(`.${ChipsAtom.chipsoverflowedClass}`)
        );
    }

    public get popup(): Locator {
        return Helpers.page.locator(`.nui-popover-container__content`);
    }
}
