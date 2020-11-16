import { animate, state, style, transition, trigger } from "@angular/animations";

type KnownAnimationEventStates = "void" | true | false;

export interface TypedAnimationEvent extends Omit<AnimationEvent, "toState" | "fromState"> {
    toState: KnownAnimationEventStates;
    fromState: KnownAnimationEventStates;
}

export const fadeIn = [
    // boring fade-in/fade-out opacity animation.
    trigger("fadeIn", [
        // anything other than true is hidden
        state("*", style({opacity: 0})),
        state("true", style({opacity: 1})),

        transition("* <=> *", animate(".2s ease-in-out")),
    ]),
];
