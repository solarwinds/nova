import { Locator } from "playwright-core";

import { Atom } from "../../atom";
import { expect } from "../../setup";

export class TextboxAtom extends Atom {
    public static CSS_CLASS = "nui-textbox";
    public get input(): Locator {
        return super.getLocator().locator(".form-control");
    }
    public acceptText = async (text: string): Promise<void> =>
        this.input.fill(text);
    public toHaveValue = async (text: string): Promise<void> =>
        await expect(this.input).toHaveValue(text);
    public clearText = async (): Promise<void> => this.input.clear();
    public toBeDisabled = async (): Promise<void> =>
        await expect(this.input).toBeDisabled();
    public toNotBeDisabled = async (): Promise<void> =>
        await expect(this.input).not.toBeDisabled();
    public toBeReadOnly = async (): Promise<void> =>
        await expect(this.input).toHaveAttribute("readonly", "");
    public toHaveError = async (): Promise<boolean> =>
        this.toContainClass("has-error");
    public toNotHaveError = async (): Promise<boolean> =>
        this.toNotContainClass("has-error");
}
