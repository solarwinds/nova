/**
 * @ignore
 */
import { CommonModule, DatePipe } from "@angular/common";
import { NgModule, Provider } from "@angular/core";
// This is not technically used here, but it does pull in the type for $localize
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import {LocalizeFn} from "@angular/localize/init";

import { imagesData as IMAGES_PRESET } from "../constants/images";
import { imagesPresetToken } from "../constants/images.constants";
import { unitConversionConstants, unitConversionToken } from "../constants/unit-conversion.constant";
import { NUI_ENV_PROVIDER } from "../environment";
import { SelectorService } from "../lib/selector/selector.service";
import { LimitToPipe } from "../pipes/limit-to.pipe";
import { UnitConversionPipe } from "../pipes/unit-conversion.pipe";
import { DomUtilService } from "../services/dom-util.service";
import { EdgeDetectionService } from "../services/edge-detection.service";
import { EventBusService } from "../services/event-bus.service";
import { EventPropagationService } from "../services/event-propagation.service";
import { HistoryStorage } from "../services/history-storage";
import { LoggerService } from "../services/log-service";
import { NotificationService } from "../services/notification-service";
import { PositionService } from "../services/position.service";
import { SearchService } from "../services/search.service";
import { TransientCacheService } from "../services/transient-cache.service";
import { UnitConversionService } from "../services/unit-conversion.service";
import { UtilService } from "../services/util.service";

import { ClickInterceptorDirective } from "./directives/click-interceptor/click-interceptor.directive";
import { ClipboardDirective } from "./directives/clipboard/clipboard.directive";
import { DragAndDropService } from "./directives/dragdrop/drag-and-drop.service";
import { DraggableDirective } from "./directives/dragdrop/draggable.directive";
import { DroppableDirective } from "./directives/dragdrop/droppable.directive";
import { ResizeObserverDirective } from "./directives/resize-observer/resize-observer.directive";
import { ResizeDirective } from "./directives/resize/resize.directive";
import { ResizerDirective } from "./directives/resizer/resizer.directive";
import { SetFocusDirective } from "./directives/set-focus/set-focus.directive";
import { ZoomContentDirective } from "./directives/zoom-content/zoom-content.directive";

/**
 * @ignore
 */
@NgModule({
    imports: [
        CommonModule,
    ],
    providers: [
        DragAndDropService,
        EventBusService,
        NUI_ENV_PROVIDER,
        UnitConversionService,
        UtilService,
        TransientCacheService,
        SearchService,
        DatePipe,
        PositionService,
        NotificationService,
        EventPropagationService,
        EdgeDetectionService,
        LoggerService,
        DomUtilService,
        SelectorService,
        HistoryStorage,
        {provide: "windowObject", useValue: window},
        {provide: unitConversionToken, useValue: unitConversionConstants} as Provider,
        {provide: imagesPresetToken, useValue: IMAGES_PRESET} as Provider,
    ],
    declarations: [
        ClickInterceptorDirective,
        ClipboardDirective,
        DraggableDirective,
        DroppableDirective,
        ResizeDirective,
        ResizeObserverDirective,
        ResizerDirective,
        SetFocusDirective,
        LimitToPipe,
        UnitConversionPipe,
        ZoomContentDirective,
    ],
    exports: [
        CommonModule,
        ClickInterceptorDirective,
        ClipboardDirective,
        DraggableDirective,
        DroppableDirective,
        ResizeDirective,
        ResizeObserverDirective,
        ResizerDirective,
        SetFocusDirective,
        UnitConversionPipe,
        ZoomContentDirective,
    ],
    entryComponents: [
    ],
})
export class NuiCommonModule {
}
