import { ListRange } from "@angular/cdk/collections";
import { SlicePipe } from "@angular/common";
import { Pipe, PipeTransform } from "@angular/core";

import { nameof } from "../../../functions/nameof";

@Pipe({name: "sliceRange", pure: false})
export class SliceRangePipe implements PipeTransform {
    slicePipe: SlicePipe = new SlicePipe();
    transform(value: unknown[], range: ListRange): unknown[] {

        if (!range.hasOwnProperty(nameof<ListRange>("start")) || !range.hasOwnProperty(nameof<ListRange>("end"))) {
            throw new Error("Invalid range provided");
        }

        return this.slicePipe.transform(value, range.start, range.end);
    }

}
