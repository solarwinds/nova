import { ProtractorBrowser } from "protractor";
import { CameraEngine } from "./CameraEngine";
import { CameraSettings } from "./CameraSettings";
import { CameraToggle } from "./CameraToggle";
import { ICameraSettings, ICameraSettingsActions } from "./types";

export class Camera {
    private currentBrowser: ProtractorBrowser;
    private cameraSettings: CameraSettings;
    private engine: CameraEngine;

    public turn: CameraToggle;
    public info: ICameraSettings;
    public say = { cheese: this.cheese.bind(this) };
    public be: ICameraSettingsActions;
    public lens = { configure: this.configure.bind(this) };

    constructor() {}

    public loadFilm(browser: ProtractorBrowser, testName: string, suiteName: string = "NUI") {
        this.currentBrowser = browser;

        this.cameraSettings = new CameraSettings();
        this.cameraSettings.currentSettings.currentTestName = testName;
        this.cameraSettings.currentSettings.currentSuiteName = suiteName;
        this.be = { ...this.cameraSettings.actions };
        this.info = this.cameraSettings.currentSettings;

        this.engine = new CameraEngine(this.currentBrowser, this.cameraSettings.currentSettings);
        this.turn = new CameraToggle(this.engine);

        return this;
    }

    private async cheese(label: string) {
        await this.engine.takePhoto(label);
    }

    private configure(): any {
        return this.engine.getToolConfig();
    }
}
