// © 2022 SolarWinds Worldwide, LLC. All rights reserved.
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
//  of this software and associated documentation files (the "Software"), to
//  deal in the Software without restriction, including without limitation the
//  rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
//  sell copies of the Software, and to permit persons to whom the Software is
//  furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
//  all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
//  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
//  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
//  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
//  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
//  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
//  THE SOFTWARE.

import isArray from "lodash/isArray";
import some from "lodash/some";
import union from "lodash/union";

export interface IValueChange {
    previousValue: any;
    currentValue: any;
}

/**
 * This function takes a source object with a prioritized list of changes. Goes through and detects the changes on every one of these structures and builds
 * a new object that respects immutability and updates object references only where necessary. This is used to merge lasagna overlays into a component state
 * that maintains its immutability and high performance of change detection.
 *
 * @param result
 * @param changes
 */
export function mergeChanges<T>(result: T, ...changes: IValueChange[]): T {
    const validChanges = changes.filter(
        (c) =>
            typeof c.previousValue !== "undefined" ||
            typeof c.currentValue !== "undefined"
    );

    // there were no changes in the provided values, so just return the input object
    if (!some(validChanges, (c) => c.currentValue !== c.previousValue)) {
        return result;
    }

    // if there is only one layer of change just return the currentValue to preserve references
    if (validChanges.length === 1) {
        return validChanges[0].currentValue;
    }

    // first we need to determine the value type
    const valueType = findType(validChanges);
    // if it's a primitive type or an array, then we don't go further and we take a new value with the highest priority
    if (!["object", "object[]"].includes(valueType)) {
        // we take the value with the last priority
        return takeHighestPriorityValue(validChanges);
    }

    // collect all the keys of all the objects in given changes
    const keys: string[] = union(
        ...validChanges.map((c) =>
            typeof c.currentValue === "object"
                ? Object.keys(c.currentValue || {})
                : []
        )
    );

    const accTemplate = valueType === "object[]" ? [] : {};

    const ret = keys.reduce((acc: Record<string, any>, key) => {
        const checkedResult =
            typeof result === "undefined" ||
            result === null ||
            typeof (<Record<string, any>>result)[key] === "undefined"
                ? undefined
                : (<Record<string, any>>result)[key];
        const nestedChanges = validChanges.map((c) => ({
            previousValue:
                typeof c.previousValue === "undefined" ||
                c.previousValue == null
                    ? undefined
                    : c.previousValue[key],
            currentValue:
                typeof c.currentValue === "undefined" || c.currentValue == null
                    ? undefined
                    : c.currentValue[key],
        }));

        // recursively execute this method for given property
        acc[key] = mergeChanges(
            checkedResult as Record<string, any>,
            ...nestedChanges
        );
        return acc;
    }, accTemplate);

    return ret as T;
}

/**
 * Take current value from given changes with highest priority - the last one wins
 *
 * @param changes
 */
function takeHighestPriorityValue(changes: IValueChange[]) {
    for (let i = changes.length - 1; i >= 0; i--) {
        const value = changes[i].currentValue;
        if (typeof value !== "undefined") {
            return value;
        }
    }
    return undefined;
}

function findType(changes: IValueChange[]): string {
    for (const c of changes) {
        const type = typeof c.currentValue;
        if (type !== "undefined" && c.currentValue != null) {
            if (isArray(c.currentValue)) {
                const arrElemType = typeof c.currentValue[0];
                if (arrElemType === "object") {
                    return "object[]";
                } else {
                    return "array";
                }
            }
            if (c.currentValue.constructor !== Object) {
                return "advanced";
            }

            return type;
        }
    }
    return typeof undefined;
}
