const keyToParseRegex = /\{.*?\}/g;
const paramsRegex = /\{|\}/g;

/**
 * Parses the string with the values in brackets.
 * e.g. "{componentId}.properties" => "chart.properties", "chart" is taken from the "data" argument.
 */
export function parseStringWithData(path: string, data: any): string {
    const match = path.match(keyToParseRegex);

    if (!match) { return path; }

    let updatedPath = path;

    for (const input of match) {
        const key = getKeyFromParam(input);
        if (data[key]) {
            updatedPath = updatedPath.replace(input, data[key]);
        } else {
            console.warn(`There's no ${input} key found in the data: ${data}`);
        }
    }

    return updatedPath;
}

const getKeyFromParam = (entry: string): string => entry.replace(paramsRegex, "");
