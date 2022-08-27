import clone from "lodash/clone";
import setWith from "lodash/setWith";

/**
 * This an immutable equivalent of lodash "set" function
 *
 * @param object
 * @param path
 * @param value
 */
export function immutableSet<T>(object: T, path: string, value: any): T {
    return path.length === 0
        ? value
        : setWith(clone(object) as any, path, value, clone);
}
