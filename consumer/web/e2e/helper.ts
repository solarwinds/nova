import * as fs from "fs";
import { browser } from "protractor";

export class Helper {

    public static BROWSER_WAIT_TIMEOUT = 5000;
    public static WORKFLOW_TIMEOUT = Helper.BROWSER_WAIT_TIMEOUT * 2;
    private static PAGE_LOAD_TIMEOUT = 1000;

    static async saveScreenShot(filename: string): Promise<void> {
        return browser.takeScreenshot().then((data) => {
            const stream = fs.createWriteStream(filename);
            stream.write(Buffer.from(data, "base64"));
            stream.end();
        });
    }

    static async waitForUrl(url: string) {
        return await browser.wait(browser.ExpectedConditions.urlContains(url), Helper.PAGE_LOAD_TIMEOUT);
    }

}
