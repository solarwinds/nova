// © 2022 SolarWinds Worldwide, LLC. All rights reserved.
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
//  of this software and associated documentation files (the "Software"), to
//  deal in the Software without restriction, including without limitation the
//  rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
//  sell copies of the Software, and to permit persons to whom the Software is
//  furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
//  all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
//  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
//  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
//  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
//  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
//  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
//  THE SOFTWARE.

import { ElementFinder } from "protractor";

import { CdkDraggableItemAtom } from "./cdk-drop-item.atom";
import { Atom } from "../../atom";

export class CdkDropListAtom extends Atom {
    public static CSS_CLASS = "cdk-drop-list";

    public async getItems(): Promise<CdkDraggableItemAtom[]> {
        return this.getElement()
            .all(Atom.getLocator(CdkDraggableItemAtom))
            .reduce(
                (acc: CdkDraggableItemAtom[], item: ElementFinder) =>
                    acc.concat(new CdkDraggableItemAtom(item)),
                []
            );
    }

    public itemCount = async (): Promise<number> =>
        (await this.getItems()).length;

    public getItem = async (idx: number): Promise<CdkDraggableItemAtom> =>
        (await this.getItems())[idx];
}
