import { ICoordinates, IInteractionPayload } from "../common/types";

/**
 * Interface used for interaction values with scaleKey as key to a dictionary of scaleId to value. Typical scale keys are "x" and "y"
 */
export interface IInteractionValues {
    [scaleKey: string]: { [scaleId: string]: any };
}

/**
 * Payload for an INTERACTION_VALUES_EVENT
 */
export interface IInteractionValuesPayload extends IInteractionPayload {
    /** The values of the interaction */
    values: IInteractionValues;
}

/**
 * Payload for an INTERACTION_COORDINATES_EVENT
 */
export interface IInteractionCoordinatesPayload extends IInteractionPayload {
    /** The coordinates of an interaction */
    coordinates: ICoordinates;
}

/** Interface for defining an element's position */
export interface IElementPosition {
    top: number;
    left: number;
    width: number;
    height: number;
}
