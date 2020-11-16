export interface IBusyConfig {
    busy: boolean;
    showProgress?: boolean;
    message?: string;
    percent?: number;
    helpText?: string;
    cancelText?: string;
    allowCancel?: boolean;
}
