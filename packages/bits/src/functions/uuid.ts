export function uuid(prefix = "") {
    let dt = new Date().getTime();
    const id = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
        // eslint-disable-next-line
        const r = (dt + Math.random() * 16) % 16 | 0;
        dt = Math.floor(dt / 16);
        // eslint-disable-next-line
        return (c === "x" ? r : (r & 0x3 | 0x8)).toString(16);
    });
    return `${prefix}_${id}`;
}
