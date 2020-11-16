import each from "lodash/each";
import { Subject } from "rxjs";

export class EventBus<T> {

    private streams: { [key: string]: Subject<T> } = {};

    public getStream(streamId: string): Subject<T> {
        if (!this.streams[streamId]) {
            this.streams[streamId] = new Subject<T>();
        }
        return this.streams[streamId];
    }

    public destroy() {
        each(Object.keys(this.streams), (key: string) => {
            this.streams[key].complete();
        });
    }

}
