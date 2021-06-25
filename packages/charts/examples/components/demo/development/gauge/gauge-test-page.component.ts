import { Component, OnDestroy } from "@angular/core";
import { ThemeSwitchService, UnitConversionService } from "@nova-ui/bits";
import {
    DEFAULT_RADIAL_RENDERER_CONFIG,
    GaugeUtil,
    IGaugeConfig,
    GaugeThresholdDefs,
    StandardGaugeThresholdId,
    StandardLinearGaugeThickness,
    IGaugeThresholdsConfig,
    Formatter,
} from "@nova-ui/charts";

@Component({
    selector: "gauge-test-page",
    templateUrl: "./gauge-test-page.component.html",
    styleUrls: ["./gauge-test-page.component.less"],
})
export class GaugeTestPageComponent implements OnDestroy {
    public value = 950;
    public maxValue = 2000;
    public thresholds: IGaugeThresholdsConfig;
    public gaugeConfig: IGaugeConfig;

    public annularGrowth = DEFAULT_RADIAL_RENDERER_CONFIG.annularGrowth;
    public thickness = StandardLinearGaugeThickness.Large;
    public donutSize = 200;

    public warningEnabled = true;
    public criticalEnabled = true;
    public enableThresholdMarkers = true;
    public reversed = false;
    public flipLabels = false;

    public lowThreshold = 1000;
    public highThreshold = 1500;
    public valueStep = 10;

    private originalWithRefreshRoute: boolean;
    private labelFormatter: Formatter<string>;

    constructor(public themeSwitcher: ThemeSwitchService, private unitConversionSvc: UnitConversionService) {
        // disable route refreshing because the theme service currently always reverts to
        // the light theme on route refresh unless route.data.showThemeSwitcher is 'true'
        this.originalWithRefreshRoute = this.themeSwitcher.withRefreshRoute;
        this.themeSwitcher.withRefreshRoute = false;

        this.labelFormatter = (d: string) => {
            const conversion = this.unitConversionSvc.convert(parseFloat(d), 1000, 2);
            return this.unitConversionSvc.getFullDisplay(conversion, "generic");
        };

        this.thresholds = GaugeUtil.createStandardThresholdsConfig(this.lowThreshold, this.highThreshold);
        this.gaugeConfig = this.getGaugeConfig();
    }

    public ngOnDestroy(): void {
        this.themeSwitcher.withRefreshRoute = this.originalWithRefreshRoute;
    }

    public onReversedChange(reversed: boolean): void {
        this.reversed = reversed;
        this.gaugeConfig = this.getGaugeConfig();
    }

    public onFlippedChange(flipped: boolean): void {
        this.flipLabels = flipped;
        this.gaugeConfig = this.getGaugeConfig();
    }

    public onValueChange(value: number): void {
        this.value = value;
        this.gaugeConfig = this.getGaugeConfig();
    }

    public onThicknessChange(thickness: number): void {
        this.thickness = thickness;
        this.gaugeConfig = this.getGaugeConfig();
    }

    public onLowThresholdChange(value: number): void {
        this.lowThreshold = value;
        this.gaugeConfig = this.getGaugeConfig();
    }

    public onHighThresholdChange(value: number): void {
        this.highThreshold = value;
        this.gaugeConfig = this.getGaugeConfig();
    }

    public onWarningEnabledChange(enabled: boolean): void {
        this.warningEnabled = enabled;
        this.gaugeConfig = this.getGaugeConfig();
    }

    public onCriticalEnabledChange(enabled: boolean): void {
        this.criticalEnabled = enabled;
        this.gaugeConfig = this.getGaugeConfig();
    }

    public onEnableThresholdMarkersChange(enabled: boolean): void {
        this.enableThresholdMarkers = enabled;
        this.gaugeConfig = this.getGaugeConfig();
    }

    private getGaugeConfig(): IGaugeConfig {
        this.updateThresholdsConfig();

        return {
            value: this.value,
            max: this.maxValue,
            thresholds: this.thresholds,
            labels: {
                formatter: this.labelFormatter,
                flipped: this.flipLabels,
            },
            linearThickness: this.thickness,
        };
    }

    private updateThresholdsConfig() {
        if (this.warningEnabled) {
            this.thresholds.definitions[StandardGaugeThresholdId.Warning].value = this.reversed ? this.highThreshold : this.lowThreshold;
        }

        if (this.criticalEnabled) {
            this.thresholds.definitions[StandardGaugeThresholdId.Critical].value = this.reversed ? this.lowThreshold : this.highThreshold;
        }

        this.thresholds.definitions[StandardGaugeThresholdId.Warning].enabled = this.warningEnabled;
        this.thresholds.definitions[StandardGaugeThresholdId.Critical].enabled = this.criticalEnabled;
        this.thresholds.reversed = this.reversed;
        this.thresholds.disableMarkers = !this.enableThresholdMarkers;
    }
}
