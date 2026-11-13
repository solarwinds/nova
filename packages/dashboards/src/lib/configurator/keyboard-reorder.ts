/** Keyboard-only interaction for existing configurator drag handles. */
export class KeyboardReorder<T> {
    public activeItem: T | undefined;
    public announcement = "";

    private originalOrder: T[] | undefined;
    private expectedOrder: T[] | undefined;
    private handle: HTMLElement | undefined;
    private moving = false;

    constructor(
        private readonly getItems: () => T[],
        private readonly move: (from: number, to: number) => void,
        private readonly isDisabled: (item: T) => boolean,
        private readonly notifyChange?: () => void
    ) {}

    public onKeydown(event: KeyboardEvent, item: T): void {
        this.handleKeydown(event, item);
        this.notifyChange?.();
    }

    private handleKeydown(event: KeyboardEvent, item: T): void {
        if (
            event.defaultPrevented ||
            event.altKey ||
            event.ctrlKey ||
            event.metaKey ||
            event.target !== event.currentTarget ||
            !(event.currentTarget instanceof HTMLElement)
        ) {
            return;
        }
        const pickup = event.key === " " || event.key === "Enter";
        const direction =
            event.key === "ArrowUp" || event.key === "ArrowLeft"
                ? -1
                : event.key === "ArrowDown" || event.key === "ArrowRight"
                ? 1
                : 0;
        if (
            !pickup &&
            (!this.originalOrder || (!direction && event.key !== "Escape"))
        ) {
            return;
        }
        event.preventDefault();
        event.stopPropagation();
        if (pickup && event.repeat) {
            return;
        }
        const items = this.getItems();
        if (this.originalOrder) {
            if (
                items.length !== this.expectedOrder?.length ||
                items.some(
                    (value, index) => value !== this.expectedOrder?.[index]
                ) ||
                this.activeItem === undefined ||
                this.isDisabled(this.activeItem)
            ) {
                this.cancel();
                return;
            }
            if (event.currentTarget !== this.handle) {
                return;
            }
            if (event.key === "Escape") {
                const originalIndex = this.originalOrder.indexOf(
                    this.activeItem
                );
                this.applyMove(items.indexOf(this.activeItem), originalIndex);
                this.clear();
                this.announcement = $localize`Reordering cancelled. Original order restored.`;
            } else if (pickup) {
                this.finish();
            } else {
                const from = items.indexOf(this.activeItem);
                const to = from + direction;
                if (to < 0 || to >= items.length) {
                    this.announcement =
                        direction < 0
                            ? $localize`Item is already first.`
                            : $localize`Item is already last.`;
                    return;
                }
                this.applyMove(from, to);
                this.expectedOrder = [...this.getItems()];
                this.announcement = $localize`Item moved to position ${
                    to + 1
                } of ${items.length}.`;
            }
        } else if (pickup && items.includes(item) && !this.isDisabled(item)) {
            this.activeItem = item;
            this.originalOrder = [...items];
            this.expectedOrder = [...items];
            this.handle = event.currentTarget;
            this.announcement = $localize`Item picked up. Use the arrow keys to move it. Press Space or Enter to drop, or Escape to cancel.`;
        }
    }

    public finish(): void {
        if (this.originalOrder && !this.moving) {
            this.clear();
            this.announcement = $localize`Reordering finished.`;
            this.notifyChange?.();
        }
    }

    public cancel(): void {
        if (this.originalOrder) {
            this.clear();
            this.announcement = $localize`Reordering cancelled because the items changed or are no longer available.`;
            this.notifyChange?.();
        }
    }

    private applyMove(from: number, to: number): void {
        this.moving = true;
        try {
            if (from !== to) {
                this.move(from, to);
            }
            this.handle?.focus({ preventScroll: true });
            this.handle?.scrollIntoView({
                block: "nearest",
                inline: "nearest",
            });
        } finally {
            this.moving = false;
        }
    }

    private clear(): void {
        this.activeItem = undefined;
        this.originalOrder = undefined;
        this.expectedOrder = undefined;
        this.handle = undefined;
    }
}
