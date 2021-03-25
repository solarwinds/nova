import { ProtractorBrowser } from "protractor";
import { ICameraSettings, ILens, PERCY_DEFAULT_CONFIG } from "./types";
import percySnapshot from "@percy/protractor";
import { SnapshotOptions } from "@percy/core";

export class PercyLens implements ILens {
    private percyConfig: SnapshotOptions;

    constructor(private browser: ProtractorBrowser, private settings: ICameraSettings) {
        this.percyConfig = { ...PERCY_DEFAULT_CONFIG };
    }

    public async takeSnapshot(label: string): Promise<void> {
        this.checkSettings();

        await percySnapshot(`${this.settings.currentTestName} - ${label}`, { ...this.percyConfig });
    }

    public async takeFullScreenSnapshot(label: string): Promise<void> {
        await this.takeSnapshot(label);
    }

    public async cameraON() {}

    public async cameraOFF() {}

    public toolConfig() { console.warn("No config is availalbe for Percy"); }

    private checkSettings() {
        this.percyConfig.widths = [...this.settings.responsive];
    }

}
