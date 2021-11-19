import * as fs from "fs";
import { ProtractorBrowser } from "protractor";
import { Helpers } from "../helpers";
import { EyesLens } from "./eyes-lens";
import { PercyLens } from "./percy-lens";
import { ICameraSettings, ILens, LENSES, LensType } from "./types";

export class CameraEngine {
    public currentLensInstance: ILens;
    private snapshotsFolderName: string = "_snapshots";

    constructor(
        private browser: ProtractorBrowser,
        private settings: ICameraSettings) {

        this.useLens();
    }

    private useLens() {
        if (!this.browser) {
            throw new Error("Protractor's 'browser' instance is required! Please pass one as an argument to the 'loadFilm()' method");
        }

        this.settings.globalLens = this.browser.params["visual"];

        if (this.settings.globalLens && LENSES.includes(this.settings.globalLens)) {

            switch (this.settings.globalLens) {
                case (LensType.Percy):
                    this.currentLensInstance = new PercyLens(this.browser, this.settings);
                    break;
                case (LensType.Eyes):
                    this.currentLensInstance = new EyesLens(this.browser, this.settings);
                    break;
            }
        } else {
            throw new Error("No suitable lenses found! Check the global lens name in your 'protractor.conf.js' file");
        }

        return this;
    }

    public async takePhoto(label: string): Promise<void> {
        if (this.browser.params["snapshotsUpload"] === "manual") {
            if (!fs.existsSync(this.snapshotsFolderName)) {
                fs.mkdirSync(this.snapshotsFolderName);
            }
            await Helpers.saveScreenShot(`${this.snapshotsFolderName}/${this.cleanFileName(this.settings.currentTestName)}_${this.cleanFileName(label)}.png`);
            return;
        }

        if (!this.settings.fullframe) {
            return await this.currentLensInstance.takeSnapshot(label);
        }

        if (this.settings.fullframe) {
            return await this.currentLensInstance.takeFullScreenSnapshot(label);
        }
    }

    public getToolConfig(): void {
        return this.currentLensInstance.toolConfig();
    }

    private cleanFileName(name: string) {
        // @ts-ignore
        return name.replace(/[\\\/\s]/g, (m) => ({ "\\": "_", "\/": "_", " ": "_" }[m]));
    }
}
