import {
    animate,
    state,
    style,
    transition,
    trigger,
    stagger,
    query,
    group,
} from "@angular/animations";

export const expand = trigger("expandedState", [
    state("expanded", style({ height: "*" })),
    state("collapsed", style({ height: 0 })),
    transition("expanded <=> collapsed", [animate("350ms ease-in-out")]),
]);

/**
 * This v2 version of the expand animation respects the animations of elements nested inside the expander's content template.
 *  It is using the special selectors that ngIf and ngFor use on projected content.
 */
export const expandV2 = trigger("expandContent", [
    transition(":enter", [
        group([
            query(
                ":self",
                [
                    style({ height: 0 }),
                    animate("350ms ease-in-out", style({ height: "*" })),
                ],
                {
                    optional: true,
                }
            ),
            query(
                "@*",
                [
                    style({ height: 0 }),
                    stagger(10, [
                        animate("250ms ease-in-out", style({ height: "*" })),
                    ]),
                ],
                {
                    optional: true,
                }
            ),
        ]),
    ]),
    transition(":leave", [
        query(":self", [
            style({ height: "*" }),
            animate("350ms ease-in-out", style({ height: 0 })),
        ]),
    ]),
]);
