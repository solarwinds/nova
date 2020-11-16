/** Common CSS filter IDs */
export enum CssFilterId {
    Grayscale = "grayscale",
}

/** CSS grayscale filter rule value */
export const GRAYSCALE_FILTER = `url("#${CssFilterId.Grayscale}")`;

/** Transformation matrix value for applying a 100% grayscale appearance to an svg element */
export const GRAYSCALE_COLOR_MATRIX =
`
0.2126 0.7152 0.0722 0 0
0.2126 0.7152 0.0722 0 0
0.2126 0.7152 0.0722 0 0
0      0      0      1 0
`;
