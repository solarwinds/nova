import { ProtractorBrowser } from "protractor";
import { EyesLens } from "./EyesLens";
import { PercyLens } from "./PercyLens";
import { ICameraSettings, ILens, LENSES, LensType } from "./types";

export class CameraEngine {
    public currentLensInstance: ILens;

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
                case(LensType.PERCY):
                    this.currentLensInstance = new PercyLens(this.browser, this.settings);
                    break;
                case(LensType.EYES):
                    this.currentLensInstance = new EyesLens(this.browser, this.settings);
                    break;
            }
        } else {
            throw new Error("No suitable lenses found! Check the global lens name in your 'protractor.conf.js' file");
        }

        return this;
    }

    public async takePhoto(label: string) {
        if (!this.settings.fullframe) {
            await this.currentLensInstance.takeSnapshot(label);
        }

        if (this.settings.fullframe) {
            await this.currentLensInstance.takeFullScreenSnapshot(label);
        }
    }
}
