/** @ignore */
export enum SrlcStage {
    preAlpha = "Under Development",
    alpha = "Alpha",
    beta = "Beta",
    ga = "Production Ready", // General availability
    support = "Deprecated",
    eol = "Not Supported", // End-of-life
}

/** @ignore */
export interface ISrlcDetails {
    stage: SrlcStage;
    version?: string;
    eolDate?: Date;
    hideIndicator?: boolean;
}
