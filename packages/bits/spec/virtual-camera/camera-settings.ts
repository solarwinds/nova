import {
    CAMERA_DEFAULT_SETTINGS,
    ICameraSettings,
    ICameraSettingsActions,
} from "./types";

export class CameraSettings {
    public currentSettings: ICameraSettings;

    constructor() {
        this.currentSettings = { ...CAMERA_DEFAULT_SETTINGS };
    }

    public actions: ICameraSettingsActions = {
        fullframe: this.fullframe.bind(this),
        crop: this.crop.bind(this),
        responsive: this.responsive.bind(this),
        defaultResponsive: this.defaultResponsive.bind(this),
    };

    private async fullframe(): Promise<void> {
        this.currentSettings.fullframe = true;
    }

    private async crop(): Promise<void> {
        this.currentSettings.fullframe = false;
    }

    private async responsive(
        values: Array<number>,
        callback?: Function
    ): Promise<void> {
        this.currentSettings.responsiveWidths = [...values];
        this.currentSettings.responsivityCallback = callback;
    }

    private async defaultResponsive(): Promise<void> {
        this.currentSettings.responsiveWidths =
            CAMERA_DEFAULT_SETTINGS.responsiveWidths;
    }
}
