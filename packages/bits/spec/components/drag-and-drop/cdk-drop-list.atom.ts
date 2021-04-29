import { by, ElementFinder } from "protractor";

import { Atom } from "../../atom";

import { CdkDraggableItemAtom } from "./cdk-drop-item.atom";

export class CdkDropListAtom extends Atom {
    public static CSS_CLASS = "cdk-drop-list";

    public async getItems(): Promise<CdkDraggableItemAtom[]> {
        return this.getElement()
            .all(by.className(CdkDraggableItemAtom.CSS_CLASS))
            .reduce((acc: CdkDraggableItemAtom[], item: ElementFinder) => acc.concat(new CdkDraggableItemAtom(item)), []);
    }

    public itemCount = async (): Promise<number> => (await this.getItems()).length;

    public getItem = async (idx: number): Promise<CdkDraggableItemAtom> => (await this.getItems())[idx];

}
