import { Locator } from "playwright-core";

import { expect, Helpers } from "./setup";

export interface IAtomClass<T> {
    findIn: (atomClass: IAtomClass<T>, arg: Locator, root?: boolean) => T;
    CSS_CLASS?: string;
    CSS_SELECTOR?: string;
    new (locator: Locator): T;
}

export class Atom {
    /**
     * Create atom from the css id
     */
    public static find<T extends Atom>(
        atomClass: IAtomClass<T>,
        id: string,
        root?: boolean
    ): T {
        return atomClass.findIn(
            atomClass,
            Helpers.page.locator(`#${id}`),
            root
        );
    }

    /**
     * Create atom from the css
     */
    public static findIn<T extends Atom>(
        atomClass: IAtomClass<T>,
        parentLocator?: Locator,
        root = false
    ): T {
        const create = (locator: Locator) => new atomClass(locator);
        const selector = Atom.getSelector(atomClass);
        if (!selector) {
            return create(parentLocator ?? Atom.getFromRoot("body"));
        }
        if (!parentLocator) {
            return create(Atom.getFromRoot(selector));
        }
        const sibling = Helpers.page.locator(selector);

        const operation = root ? "and" : "locator";

        return create(parentLocator[operation](sibling));
    }

    public static getFromRoot(selector: string): Locator {
        return Helpers.page.locator("body").locator(selector);
    }

    public static getSelector<T extends Atom>(
        atomClass: IAtomClass<T>
    ): string | null {
        if (atomClass.CSS_CLASS) {
            return `.${atomClass.CSS_CLASS}`;
        }
        if (atomClass.CSS_SELECTOR) {
            return atomClass.CSS_SELECTOR;
        }

        return null;
    }

    private locator: Locator;

    constructor(locator: Locator) {
        this.locator = locator;
    }

    public async toNotContainClass(className: string | string[]): Promise<any> {
        return await expect(this.locator).not.toContainClass(className);
    }

    public async toContainClass(className: string | string[]): Promise<any> {
        return await expect(this.locator).toContainClass(className);
    }

    /**
     * @Deprecated: use Atom.toContainClass.
     * see ../../ASSERTING_VALUE.md
     */
    public async hasClass(cls: string): Promise<boolean> {
        const classList = await this.locator.getAttribute("class");
        return (classList || "").split(" ").includes(cls);
    }

    public async toBeDisabled(): Promise<any> {
        return await expect(this.locator).toBeDisabled();
    }

    public async toBeVisible(): Promise<any> {
        return await expect(this.locator).toBeVisible();
    }

    public async toBeHidden(): Promise<any> {
        return await expect(this.locator).toBeHidden();
    }

    public getLocator(): Locator {
        return this.locator;
    }

    public nth<T extends Atom>(atomClass: IAtomClass<T>, index: number): T {
        // it should take existing class and return the class which will be limited to the index
        // this.limit it and for example the click will be perfomed agains the only on insance
        // this.getLocator(); // all of them
        const locator = this.getLocator().nth(index); // the locator of the only one item
        return new atomClass(locator);
        // how to return the atom
    }

    public first<T extends Atom>(atomClass: IAtomClass<T>): T {
        return this.nth(atomClass, 0);
    }

    // function spawnWrapper (...params: [
    //     Parameters<typeof spawn>[0],
    //     Parameters<typeof spawn>[1],
    // ]) {
    //     return spawn(...params);
    // }
    public filter<T extends Atom>(
        atomClass: IAtomClass<T>,
        ...filter: Parameters<Locator["filter"]>
    ): T {
        // it should take existing class and return the class which will be limited to the index
        // this.limit it and for example the click will be perfomed agains the only on insance
        // this.getLocator(); // all of them
        const locator = this.getLocator().filter(...filter); // the locator of the only one item
        return new atomClass(locator);
        // how to return the atom
    }

    public async click(): Promise<void> {
        await this.locator.click();
    }

    public async hover(target?: Locator, force: boolean = false): Promise<void> {
        if (target) {
            await target.hover( { force });
            return;
        }
        await this.locator.hover({ force });
    }
}
