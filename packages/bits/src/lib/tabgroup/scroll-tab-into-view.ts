export function scrollTabIntoView(
    tab: HTMLElement,
    container: HTMLElement
): string {
    const viewport = container.parentElement!;
    // Keep keyboard and mouse traversal on the same margin-based offset.
    viewport.scrollLeft = 0;
    const viewportRect = viewport.getBoundingClientRect();
    const tabRect = tab.getBoundingClientRect();
    let shift = Number.parseFloat(container.style.marginLeft || "0");
    if (tabRect.left < viewportRect.left) {
        shift += viewportRect.left - tabRect.left;
    } else if (tabRect.right > viewportRect.right) {
        shift -= tabRect.right - viewportRect.right;
    }
    const maxShift = Math.max(0, container.scrollWidth - viewport.clientWidth);
    return `${Math.max(-maxShift, Math.min(0, shift))}px`;
}
