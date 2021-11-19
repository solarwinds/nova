export function traverse(obj: { [x: string]: any }, fn: (obj: any, path: string[]) => any, path: string[] = []): void {
    // eslint-disable-next-line
    for (const k in obj) {
        const newPath = [...path, k];
        if (obj[k] && typeof obj[k] === "object") {
            traverse(obj[k], fn, newPath);
        } else {
            fn(obj[k], newPath);
        }
    }
}
