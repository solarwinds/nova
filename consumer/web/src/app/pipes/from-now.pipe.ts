import { Pipe, PipeTransform } from "@angular/core";
import moment from "moment/moment";

@Pipe({
  name: "fromNow",
})
export class FromNowPipe implements PipeTransform {

  transform(value: Date | moment.Moment): string {
    return moment(value).fromNow();
  }

}
