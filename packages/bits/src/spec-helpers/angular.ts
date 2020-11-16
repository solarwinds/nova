import { ChangeDetectorRef } from "@angular/core";

export class MockedChangeDetectorRef extends ChangeDetectorRef {
    checkNoChanges(): void {
    }

    detach(): void {
    }

    detectChanges(): void {
    }

    markForCheck(): void {
    }

    reattach(): void {
    }
}
