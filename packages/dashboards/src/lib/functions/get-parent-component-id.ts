/**
 * Gets parent component id in the pizzagna.
 * Valid ONLY for the component ids which have parent in the their own id!
 *
 * e.g. for "kpi3/description" gets "kpi3"
 */
export function getParentComponentId(path: string): string {
    const parts = path.split("/");

    return parts?.length > 1
        ? parts[parts.length - 2]
        : path;
}

