import sum from "lodash/sum";

import { IProportionalAggregatorFn } from "./types";

export const sumAggregator: IProportionalAggregatorFn =
    (origin) => sum(origin.map(entry => entry.data[0]));

sumAggregator.aggregatorType = "Sum";
