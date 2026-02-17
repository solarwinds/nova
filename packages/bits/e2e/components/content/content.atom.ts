import { Atom } from "../../atom";
import { expect } from "../../setup";

export class ContentAtom extends Atom {
    public static CSS_CLASS = "nui-content";

    public async toHaveScrollbar(): Promise<void> {
        await expect
            .poll(async () => {
                const el = this.getLocator();
                return await el.evaluate(
                    (e) => e.scrollHeight > e.clientHeight
                );
            })
            .toBe(true);
    }

    public async toNotHaveScrollbar(): Promise<void> {
        await expect
            .poll(async () => {
                const el = this.getLocator();
                return await el.evaluate(
                    (e) => e.scrollHeight > e.clientHeight
                );
            })
            .toBe(false);
    }
}
