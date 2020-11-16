import {
    animate,
    state,
    style,
    transition,
    trigger
} from "@angular/animations";

export const expand = trigger("expandedState", [
    state("expanded", style({height: "*"})),
    state("collapsed", style({height: 0})),
    transition("expanded <=> collapsed", [
        animate("350ms ease-in-out"),
    ]),
]);
