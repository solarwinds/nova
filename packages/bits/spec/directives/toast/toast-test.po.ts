import { $, by, ElementFinder } from "protractor";

import { Atom } from "../../atom";

import { ToastAtom } from "./toast.atom";

// interfaces duplicated here because if we import them from lib, dist-copy for atoms will work improperly
export interface IToastDeclaration {
    title?: string;
    message?: string;
    options?: IToastConfig;
    itemsToHighlight?: any[];
}

export const enum ToastPositionClass {
    TOP_CENTER = "nui-toast--top-center",
    TOP_LEFT = "nui-toast--top-left",
    TOP_RIGHT = "nui-toast--top-right",
    TOP_FULL_WIDTH = "nui-toast--top-full-width",
    BOTTOM_CENTER = "nui-toast--bottom-center",
    BOTTOM_FULL_WIDTH = "nui-toast--bottom-full-width",
    BOTTOM_RIGHT = "nui-toast--bottom-right",
    BOTTOM_LEFT = "nui-toast--bottom-left",
}

export interface IToastConfig {
    timeOut?: number;
    closeButton?: boolean;
    extendedTimeOut?: number;
    progressBar?: boolean;
    progressAnimation?: "increasing" | "decreasing";
    enableHtml?: boolean;
    toastClass?: string;
    positionClass?: ToastPositionClass | string;
    clickToDismiss?: boolean;
    stickyError?: boolean;
    maxOpened?: number;
    autoDismiss?: boolean;
    newestOnTop?: boolean;
    preventDuplicates?: boolean;
}

export class ToastTestPage {
    private readonly waitTimeout = 1000;

    private body = $("body");
    private root = $("#nui-toast-test");

    private txtCount = this.root.element(by.id("txtCount"));
    private radioError = this.root.element(by.id("radioError"));
    private radioInfo = this.root.element(by.id("radioInfo"));
    private radioSuccess = this.root.element(by.id("radioSuccess"));
    private radioWarning = this.root.element(by.id("radioWarning"));

    private txtMessage = this.root.element(by.id("txtMessage"));
    private txtTitle = this.root.element(by.id("txtTitle"));

    private txtTimeOut = this.root.element(by.id("txtTimeOut"));
    private txtExtendedTimeOut = this.root.element(by.id("txtExtendedTimeOut"));
    private chbCloseButton = this.root.element(by.id("chbCloseButton"));
    private chbProgressBar = this.root.element(by.id("chbProgressBar"));
    private radioIncreasing = this.root.element(by.id("radioIncreasing"));
    private radioDecreasing = this.root.element(by.id("radioDecreasing"));
    private chbEnableHtml = this.root.element(by.id("chbEnableHtml"));
    private txtToastClass = this.root.element(by.id("txtToastClass"));
    private radioTopCenter = this.root.element(by.id("radioTopCenter"));
    private radioTopLeft = this.root.element(by.id("radioTopLeft"));
    private radioTopRight = this.root.element(by.id("radioTopRight"));
    private radioTopFullWidth = this.root.element(by.id("radioTopFullWidth"));
    private radioBottomCenter = this.root.element(by.id("radioBottomCenter"));
    private radioBottomLeft = this.root.element(by.id("radioBottomLeft"));
    private radioBottomRight = this.root.element(by.id("radioBottomRight"));
    private radioBottomFullWidth = this.root.element(
        by.id("radioBottomFullWidth")
    );
    private radioCustomClass = this.root.element(by.id("radioCustomClass"));
    private chbClickToDismiss = this.root.element(by.id("chbClickToDismiss"));
    private chbStickyError = this.root.element(by.id("chbStickyError"));
    private txtMaxOpened = this.root.element(by.id("txtMaxOpened"));
    private chbAutoDismiss = this.root.element(by.id("chbAutoDismiss"));
    private chbNewestOnTop = this.root.element(by.id("chbNewestOnTop"));
    private chbPreventDuplicates = this.root.element(
        by.id("chbPreventDuplicates")
    );

    private btnFire = this.root.element(by.id("btnFire"));
    private btnReset = this.root.element(by.id("btnReset"));

    private radioTypes: Record<string, ElementFinder> = {
        error: this.radioError,
        info: this.radioInfo,
        success: this.radioSuccess,
        warning: this.radioWarning,
    };

    private positionElements: ElementFinder[] = [
        this.radioTopCenter,
        this.radioTopLeft,
        this.radioTopRight,
        this.radioTopFullWidth,
        this.chbStickyError,
        this.radioBottomCenter,
        this.radioBottomLeft,
        this.radioBottomRight,
        this.radioBottomFullWidth,
        this.radioCustomClass,
    ];

    private updateCheckBox = this.updateSelectable;

    public async showToasts(
        declaration: IToastDeclaration,
        type: string = "info",
        count: number = 1
    ): Promise<void> {
        await this.updateTextBox(this.txtTitle, declaration.title || "");
        await this.updateTextBox(this.txtMessage, declaration.message || "");

        if (declaration.options) {
            await this.updateTextBox(
                this.txtTimeOut,
                "" + declaration.options.timeOut
            );
            await this.updateTextBox(
                this.txtExtendedTimeOut,
                "" + declaration.options.extendedTimeOut
            );
            // @ts-ignore: Disabled for testing purposes
            await this.updateCheckBox(
                this.chbEnableHtml,
                declaration.options.enableHtml
            );

            // TODO: update all the other options
            // @ts-ignore: Disabled for testing purposes
            await this.updateCheckBox(
                this.chbClickToDismiss,
                declaration.options.clickToDismiss
            );
        }

        for (const element of this.positionElements) {
            const el = await element.getAttribute("value");

            if (declaration.options?.positionClass === el) {
                await this.updateRadio(element);
            }
        }

        await this.updateRadio(this.radioTypes[type]);
        await this.updateTextBox(this.txtCount, count.toString());

        return this.btnFire.click();
    }

    public async reset(): Promise<void> {
        return this.btnReset.click();
    }

    public getToast(index: number = 0): ToastAtom {
        return Atom.findIn<ToastAtom>(ToastAtom, this.body, index);
    }

    public async getToastCount(): Promise<number> {
        return Atom.findCount(ToastAtom, this.body);
    }

    private async updateTextBox(
        input: ElementFinder,
        value: string
    ): Promise<void> {
        const currentValue = await input.getAttribute("value");
        if (currentValue === value) {
            return;
        }
        await input.clear();
        return input.sendKeys(value);
    }

    private async updateRadio(input: ElementFinder): Promise<void> {
        return this.updateSelectable(input, true);
    }

    private async updateSelectable(
        input: ElementFinder,
        value: boolean
    ): Promise<void> {
        const currentValue = await input.isSelected();
        if (currentValue === value) {
            return;
        }
        return input.click();
    }
}
