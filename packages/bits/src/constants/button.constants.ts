/** @ignore */
export interface IButtonConstants {
    repeatDelay: number;
    repeatInterval: number;
    iconSizeMap: { [key: string]: string };
}

/** @ignore */
export const buttonConstants: IButtonConstants = {
    repeatDelay: 400,
    repeatInterval: 100,
    iconSizeMap: { "large": "",
        "default": "",
        "compact": "small" },
};
