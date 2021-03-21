import { CAMERA_DEFAULT_SETTINGS, ICameraSettings, ICameraSettingsActions } from "./types";

export class CameraSettings {
    public currentSettings: ICameraSettings;

    constructor() {
        this.currentSettings = { ...CAMERA_DEFAULT_SETTINGS };
    }

    public actions: ICameraSettingsActions = {
        fullframe: this.fullframe.bind(this),
        crop: this.crop.bind(this),
        manualfocus: this.manualfocus.bind(this),
        responsive: this.responsive.bind(this),
        defaultResponsive: this.defaultResponsive.bind(this),
    }

    private async fullframe(): Promise<void> { this.currentSettings.crop = false }

    private async crop(): Promise<void> { this.currentSettings.crop = true }

    private async manualfocus(): Promise<void> { this.currentSettings.autofocus = false }

    private async responsive(values: Array<number>): Promise<void> { this.currentSettings.responsive = [...values] }

    private async defaultResponsive(): Promise<void> { this.currentSettings.responsive = CAMERA_DEFAULT_SETTINGS.responsive }


}
