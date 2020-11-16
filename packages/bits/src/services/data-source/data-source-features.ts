import { Subject } from "rxjs";

import { IDataSourceFeatures, IDataSourceFeaturesConfiguration } from "./public-api";

export class DataSourceFeatures implements IDataSourceFeaturesConfiguration {
    public featuresChanged = new Subject<IDataSourceFeatures>();

    private supportedFeatures: IDataSourceFeatures;

    constructor(features: IDataSourceFeatures = {}) {
        this.supportedFeatures = features;
    }

    public getSupportedFeatures(): IDataSourceFeatures {
        return this.supportedFeatures;
    }

    public setSupportedFeatures(features: IDataSourceFeatures) {
        this.supportedFeatures = features;
        this.featuresChanged.next(features);
    }

    public getFeatureConfig(key: string) {
        return this.supportedFeatures?.[key];
    }
}
