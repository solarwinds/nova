// © 2022 SolarWinds Worldwide, LLC. All rights reserved.
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
//  of this software and associated documentation files (the "Software"), to
//  deal in the Software without restriction, including without limitation the
//  rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
//  sell copies of the Software, and to permit persons to whom the Software is
//  furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
//  all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
//  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
//  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
//  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
//  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
//  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
//  THE SOFTWARE.

import { Component } from "@angular/core";

@Component({
    selector: "nui-widget-error-handling-docs",
    templateUrl: "./widget-error-handling-docs.component.html",
})
export class WidgetErrorHandlingDocsComponent {
    public fallbackAdapter = `
@Injectable()
export class StatusContentFallbackAdapter implements OnDestroy, IHasComponent {

    protected readonly destroy$ = new Subject<void>();
    protected componentId: string;

    constructor(@Inject(PIZZAGNA_EVENT_BUS) protected eventBus: EventBus<IEvent>,
                protected pizzagnaService: PizzagnaService) {
        this.eventBus.getStream(DATA_SOURCE_OUTPUT)
            .pipe(takeUntil(this.destroy$)).subscribe((event: IEvent<any | IDataSourceOutputPayload<any>>) => {
                this.handleDataSourceOutput(event);
            });
    }

    public ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    public setComponent(component: any, componentId: string) {
        this.componentId = componentId;
    }

    protected handleDataSourceOutput(event: IEvent<any | IDataSourceOutputPayload<any>>) {
        this.pizzagnaService.setProperty({
            componentId: this.componentId,
            propertyPath: ["fallbackKey"],
            pizzagnaKey: PizzagnaLayer.Data,
        }, typeof event.payload?.error?.type !== "undefined" ? event.payload?.error?.type.toString() : undefined);
    }
}`;
    public errorsMap = `
export const ERROR_FALLBACK_MAP: Record<string, ErrorNodeKey> = {
    [HttpStatusCode.Unknown]: ErrorNodeKey.ErrorUnknown,
    [HttpStatusCode.Forbidden]: ErrorNodeKey.ErrorForbidden,
    [HttpStatusCode.NotFound]: ErrorNodeKey.ErrorNotFound,
};
`;
    public errorNodes = `
export const ERROR_NODES: Record<string, IComponentConfiguration> = {
    [ErrorNodeKey.ErrorUnknown]: {
        id: ErrorNodeKey.ErrorUnknown,
        componentType: WidgetErrorComponent.lateLoadKey,
        properties: {
            image: "no-data-to-show",
            title: $localize\`Whoops, something went wrong\`,
            description: $localize\`There was an unexpected error.\`,
        } as IWidgetErrorDisplayProperties,
    },
    [ErrorNodeKey.ErrorForbidden]: {
        id: ErrorNodeKey.ErrorForbidden,
        componentType: WidgetErrorComponent.lateLoadKey,
        properties: {
            image: "no-data-to-show",
            title: $localize\`403 - Forbidden\`,
            description: $localize\`The requested action was forbidden.\`,
        } as IWidgetErrorDisplayProperties,
    },
    [ErrorNodeKey.ErrorNotFound]: {
        id: ErrorNodeKey.ErrorNotFound,
        componentType: WidgetErrorComponent.lateLoadKey,
        properties: {
            image: "no-data-to-show",
            title: $localize\`404 - Not Found\`,
            description: $localize\`The requested resource could not be found.\`,
        } as IWidgetErrorDisplayProperties,
    },
};`;
    public widgetBodyContentNodesSignature = `
/**
 * Retrieves an index of the basic widget body content nodes including fallback nodes
 *
 * @param mainContentNodeKey The key corresponding to the main body content node
 * @param fallbackAdapterId The id for the adapter responsible for activating fallback content in case of an error
 * @param fallbackMap A map of node keys to fallback content definitions
 * @param fallbackNodes An index of fallback content definitions
 *
 * @returns An index of component configurations
 */
export function widgetBodyContentNodes(
    mainContentNodeKey: string,
    fallbackAdapterId = NOVA_STATUS_CONTENT_FALLBACK_ADAPTER,
    fallbackMap: Record<string, string> = ERROR_FALLBACK_MAP,
    fallbackNodes: Record<string, IComponentConfiguration> = ERROR_NODES
): Record<string, IComponentConfiguration> { ... }
`;
}
