import { expect, Helpers } from "./setup";
import { Locator } from "playwright-core";

export interface IAtomClass<T> {
    findIn: (atomClass: IAtomClass<T>, arg: Locator) => T;
    CSS_CLASS?: string;
    CSS_SELECTOR?: string;
    new (locator: Locator): T;
}

export class Atom {
    public locator: Locator;

    constructor(locator: Locator) {
        this.locator = locator;
    }

    /**
     * Create atom from the css id
     */
    public static find<T extends Atom>(
        atomClass: IAtomClass<T>,
        id: string
    ): T {
        return atomClass.findIn(atomClass, Helpers.page.locator(`#${id}`));
    }

    /**
     * Create atom from the css
     */
    public static findIn<T extends Atom>(
        atomClass: IAtomClass<T>,
        parentLocator: Locator
    ): T {
        const create = (locator: Locator) => new atomClass(locator);
        const selector = Atom.getSelector(atomClass);
        if (!parentLocator) {
            return create(Atom.getFromRoot(selector));
        }

        return create(parentLocator);
    }

    public static getFromRoot(selector: string): Locator {
        return Helpers.page.locator("body").locator(selector);
    }

    public static getSelector<T extends Atom>(
        atomClass: IAtomClass<T>
    ): string {
        if (atomClass.CSS_CLASS) {
            return `.${atomClass.CSS_CLASS}`;
        }
        if (atomClass.CSS_SELECTOR) {
            return atomClass.CSS_SELECTOR;
        }
        throw new ReferenceError(
            `expected atom class ${atomClass.name} to have either CSS_CLASS or CSS_SELECTOR nonempty`
        );
    }

    public async toNotContainClass(className: string | string[]) {
        return await expect(this.locator).not.toContainClass(className);
    }

    public async toContainClass(className: string | string[]) {
        return await expect(this.locator).toContainClass(className);
    }

    public async hasClass(cls: string): Promise<boolean> {
        const classList = await this.locator.getAttribute("class");
        return (classList || "").split(" ").includes(cls);
    }

    public async isDisabled() {
        return await expect(this.locator).toBeDisabled();
    }

    public async isVisible() {
        return await expect(this.locator).toBeVisible();
    }

    public getLocator(): Locator {
        return this.locator;
    }
}
