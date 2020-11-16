import startsWith from "lodash/startsWith";
import trim from "lodash/trim";
import trimEnd from "lodash/trimEnd";
import trimStart from "lodash/trimStart";

export function getColorValueByName(colorVariable: string): string {
    if (!startsWith(colorVariable, "var(")) {
        return colorVariable;
    }
    const colorName = trim(trimEnd(trimStart(colorVariable, "var("), ")"));
    return getComputedStyle(document.body).getPropertyValue(colorName);
}
