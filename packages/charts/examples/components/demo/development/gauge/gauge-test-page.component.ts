import { Component, OnDestroy } from "@angular/core";
import { ThemeSwitchService } from "@nova-ui/bits";
import {
    DEFAULT_RADIAL_RENDERER_CONFIG,
    GaugeUtil,
    IGaugeConfig,
    IGaugeThresholdConfigs,
    StandardGaugeThresholdId,
    StandardLinearGaugeThickness,
} from "@nova-ui/charts";

@Component({
    selector: "gauge-test-page",
    templateUrl: "./gauge-test-page.component.html",
    styleUrls: ["./gauge-test-page.component.less"],
})
export class GaugeTestPageComponent implements OnDestroy {
    public value = 950;
    public maxValue = 2000;
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

    public thresholds: IGaugeThresholdConfigs = {
        ...GaugeUtil.createStandardThresholdConfigs(this.lowThreshold, this.highThreshold),
        // "hey": {
        //     id: "hey",
        //     value: 900,
        //     enabled: true,
        //     color: "green",
        // },
    };


    public gaugeConfig: IGaugeConfig;

    private originalWithRefreshRoute: boolean;

    constructor(public themeSwitcher: ThemeSwitchService) {
        // this.thresholds = new Array(200).fill(null).map((e, i) => i);
        // this.thresholds = [50, 75, 100, 125, 150, 175, 200];

        // disable route refreshing because the theme service currently always reverts to
        // the light theme on route refresh unless route.data.showThemeSwitcher is 'true'
        this.originalWithRefreshRoute = this.themeSwitcher.withRefreshRoute;
        this.themeSwitcher.withRefreshRoute = false;

        this.gaugeConfig = this.getGaugeConfig();
    }

    public ngOnDestroy(): void {
        this.themeSwitcher.withRefreshRoute = this.originalWithRefreshRoute;
    }

    public onReversedChange(reversed: boolean): void {
        this.reversed = reversed;
        this.gaugeConfig = this.getGaugeConfig();
    }

    public onValueChange(value: number): void {
        this.value = value;
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
        if (this.warningEnabled) {
            this.thresholds[StandardGaugeThresholdId.Warning].value = this.reversed ? this.highThreshold : this.lowThreshold;
        }

        if (this.criticalEnabled) {
            this.thresholds[StandardGaugeThresholdId.Critical].value = this.reversed ? this.lowThreshold : this.highThreshold;
        }

        this.thresholds[StandardGaugeThresholdId.Warning].enabled = this.warningEnabled;
        this.thresholds[StandardGaugeThresholdId.Critical].enabled = this.criticalEnabled;

        return {
            value: this.value,
            max: this.maxValue,
            reversedThresholds: this.reversed,
            thresholds: this.thresholds,
            disableThresholdMarkers: !this.enableThresholdMarkers,
        };
    }
}
