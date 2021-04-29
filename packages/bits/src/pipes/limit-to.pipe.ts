import { Pipe, PipeTransform } from "@angular/core";
import take from "lodash/take";

/**
 * Filter used for limiting amount of items in array
 *
 * __Parameters :__
 *
 *   limit - basically, length of the resulting array
 *
 * __Usage :__
 *   array | limitTo:limit
 *
 * __Example :__
 *   <code>{{ [1,2,3,4,5,6,7] | limitTo:3 }}</code>
 *
 */
@Pipe({
    name: "limitTo",
})
export class LimitToPipe implements PipeTransform {
    transform(collection: any[], limitTo: number): any[] {
        return take(collection, limitTo);
    }
}
