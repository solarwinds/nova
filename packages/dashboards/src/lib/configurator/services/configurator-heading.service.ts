import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

@Injectable()
export class ConfiguratorHeadingService {
    public height$: BehaviorSubject<number> = new BehaviorSubject<number>(0);
}
