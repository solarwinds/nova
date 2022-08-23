import { Pipe, PipeTransform } from "@angular/core";
import isArray from "lodash/isArray";
import isNil from "lodash/isNil";

@Pipe({ name: "nuiAddData" })
export class AddDataPipe implements PipeTransform {
    transform(
        origin: object | Array<any> | undefined,
        value: any,
        key?: string
    ): object | Array<any> | any[] | undefined {
        if (isNil(origin)) {
            return;
        }

        if (isArray(origin)) {
            if (!value) {
                return origin;
            }

            const newArr = [...origin];
            newArr.push(value);

            return newArr;
        }

        const computedKey: string =
            typeof key === "undefined" ? "undefined" : key;
        return Object.assign({}, origin, { [computedKey]: value });
    }
}
