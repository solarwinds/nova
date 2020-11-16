import { by, ElementFinder, Key } from "protractor";

import { Atom } from "../../atom";

export class TextboxAtom extends Atom {
    public static CSS_CLASS = "nui-textbox";

    public get input(): ElementFinder {
        return super.getElement().element(by.className("form-control"));
    }

    /**
     * Because typescript getters and setters do not support async\await features I'm changing this
     * getter to a regular public method. Any suggestions are welcomed.
     *
     * See this issue for more information on this technical limitation:
     * https://github.com/Microsoft/TypeScript/issues/14982#issuecomment-294437284
     * https://github.com/tc39/ecmascript-asyncawait/issues/15
     */

    public getValue = async (): Promise<string> => this.input.getAttribute("value");

    public acceptText = async (text: string): Promise<void> => this.input.sendKeys(text);

    public clearText = async (): Promise<void> => this.input.clear();

    public deleteTextManually = async (): Promise<void> => this.input.sendKeys(Key.chord(Key.CONTROL, "a"), Key.DELETE);

    public hasAttribute = async (attrName: string): Promise<boolean> => (await this.input.getAttribute(attrName)) !== null;

    public disabled = async (): Promise<boolean> => this.hasAttribute("disabled");

    public isReadonly = async (): Promise<boolean> => this.hasAttribute("readonly");

    public async hasError(): Promise<boolean> { return super.hasClass("has-error"); }
}
