import { ProtractorBrowser } from "protractor";
import { ICameraSettings, ILens, PERCY_DEFAULT_CONFIG } from "./types";

export interface PercyLensSnapshotOptions {
    widths?: number[];
    minHeight?: number;
    percyCSS?: string;
    enableJavaScript?: boolean;
  }

export class PercyLens implements ILens {
    private percySnapshot = require("@percy/protractor");
    private percyConfig: PercyLensSnapshotOptions;

    constructor(private browser: ProtractorBrowser, private settings: ICameraSettings) {
        this.percyConfig = { ...PERCY_DEFAULT_CONFIG };
    }

    public async takeSnapshot(label: string): Promise<void> {
        this.checkSettings();

        await this.percySnapshot(`${this.settings.currentTestName} - ${label}`, { ...this.percyConfig });
    }

    public async takeFullScreenSnapshot(label: string): Promise<void> {
        await this.takeSnapshot(label);
    }

    public async cameraON() {}

    public async cameraOFF() {}

    public toolConfig() { console.warn("No config is available for Percy"); }

    private checkSettings() {
        this.percyConfig.widths = [...this.settings.responsiveWidths];
    }

}
