import {
    animate,
    state,
    style,
    transition,
    trigger,
    stagger,
    query
} from "@angular/animations";

export const expand = trigger("expandedState", [
    state("expanded", style({height: "*"})),
    state("collapsed", style({height: 0})),
    transition("expanded <=> collapsed", [
        animate("350ms ease-in-out"),
    ]),
]);

    /**
     * This animation is using the special selectors that ngIf and ngFor use on newly inserted or removed content.
     */
export const expandV2 = trigger('expandedAddition', [
    transition(":enter", [
        style({ height: 0 }),
        animate("350ms ease-in", style({ height: "*" })),
        query("@*", 
            stagger(300, [
                animate("350ms ease-in", style({ height: "*" })),
            ]),{optional: true})
    ]),
    transition(":leave", [
        style({ height: "*" }),
        animate("350ms ease-out", style({ height: 0 })),
    ])
]);
