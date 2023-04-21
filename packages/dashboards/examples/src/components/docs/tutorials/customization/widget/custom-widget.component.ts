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

import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    EventEmitter,
    HostBinding,
    Input,
    OnChanges,
    OnInit,
    Output,
    SimpleChanges,
} from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { GridsterConfig, GridsterItem } from "angular-gridster2";

import { IMenuItem } from "@nova-ui/bits";
import {
    ComponentRegistryService,
    ConfiguratorHeadingService,
    DEFAULT_PIZZAGNA_ROOT,
    EVENT_PROXY,
    FormStackComponent,
    IConverterFormPartsProperties,
    IDashboard,
    IHasChangeDetector,
    IHasForm,
    IProviderConfiguration,
    IWidget,
    IWidgets,
    IWidgetTypeDefinition,
    NOVA_GENERIC_CONVERTER,
    NOVA_TITLE_AND_DESCRIPTION_CONVERTER,
    PizzagnaLayer,
    refresher,
    StackComponent,
    TitleAndDescriptionConfigurationComponent,
    WellKnownPathKey,
    WellKnownProviders,
    widgetBodyContentNodes,
    WidgetConfiguratorSectionComponent,
    WidgetTypesService,
    WIDGET_BODY,
    WIDGET_HEADER,
    WIDGET_LOADING,
} from "@nova-ui/dashboards";

// The custom widget type name we'll use
const CUSTOM_WIDGET_TYPENAME = "example-custom-widget";
// The path key we'll use for image selection in the configurator definition
const IMAGE_SELECTION_CONFIGURATOR_PATH_KEY = "imageSelection";

@Component({
    selector: "custom-widget-body",
    // A simple template for our custom widget
    template: `<nui-image [image]="imageSource"></nui-image>`,
    styleUrls: ["./custom-widget.component.less"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
// Remember to declare this class in the parent module
export class CustomWidgetBodyContentComponent implements IHasChangeDetector {
    // Ensure that the lateLoadKey value matches class name
    public static lateLoadKey = "CustomWidgetBodyContentComponent";

    // Optionally, providing an input for styling of the host element
    @Input() @HostBinding("class") public elementClass = "";

    // We'll map this input with the configurator form using the NOVA_GENERIC_CONVERTER.
    // See the customWidget definition at the bottom of the file.
    @Input() public imageSource: string;

    // Injecting the ChangeDetectorRef to implement IHasChangeDetector.
    // This allows the dashboard framework to reliably propagate component property changes to the DOM.
    constructor(public changeDetector: ChangeDetectorRef) {}
}

/**
 * A custom configurator section component for selecting the image source for the custom widget
 */
@Component({
    selector: "custom-configurator-section",
    template: `
        <!-- The nuiWidgetEditorAccordionFormState pipe keeps the editor accordion state updated based on the state of the form -->
        <nui-widget-editor-accordion
            [formGroup]="form"
            [state]="form | nuiWidgetEditorAccordionFormState | async"
        >
            <!-- The accordionHeader attribute lets the accordion component know which element to use as its header -->
            <div accordionHeader class="d-flex align-items-center pl-4 py-2">
                <!-- nuiFormHeaderIconPipe detects errors on the form and replaces the regular icon with an error icon if necessary -->
                <nui-icon
                    class="align-self-start pt-2"
                    [icon]="form | nuiFormHeaderIconPipe : 'image' | async"
                ></nui-icon>
                <div class="d-flex flex-column ml-4 pt1">
                    <span class="nui-text-label" i18n>Image Selection</span>
                    <div [title]="imageDisplayValue" class="nui-text-secondary">
                        {{ imageDisplayValue }}
                    </div>
                </div>
            </div>
            <div class="custom-configurator-section__accordion-content">
                <nui-form-field
                    caption="Select an image:"
                    i18n-caption
                    [control]="form.get('imageSource')"
                >
                    <!-- The dropdown for image source selection -->
                    <nui-select-v2
                        formControlName="imageSource"
                        placeholder="No image selected"
                        i18n-placeholder
                        [popupViewportMargin]="
                            configuratorHeading.height$ | async
                        "
                        (valueSelected)="onChanged($event)"
                    >
                        <nui-select-v2-option
                            *ngFor="let item of imageItems"
                            [value]="item.url"
                        >
                            {{ item.title }}
                        </nui-select-v2-option>
                    </nui-select-v2>
                </nui-form-field>
            </div>
        </nui-widget-editor-accordion>
    `,
    styleUrls: ["./custom-widget.component.less"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
// Remember to declare this class in the parent module
export class CustomConfiguratorSectionComponent
    implements OnInit, OnChanges, IHasChangeDetector, IHasForm
{
    // Ensure that the lateLoadKey value matches the class name
    public static lateLoadKey = "CustomConfiguratorSectionComponent";

    /**
     * This input serves as the itemsSource a user can select an image from.
     */
    @Input() imageItems: IMenuItem[] = [];
    /**
     * This property holds the currently selected image source string.
     */
    @Input() imageSource: string;

    /**
     * An output for emitting formReady to allow the immediate parent formGroup component to register us as a form control
     * in the larger form. In this case, the immediate parent would be the WidgetConfiguratorSectionComponent as specified
     * in the customWidget configurator definition at the bottom of this file.
     */
    @Output() formReady = new EventEmitter<FormGroup>();

    public form: FormGroup;
    public imageDisplayValue: string;

    constructor(
        public changeDetector: ChangeDetectorRef,
        private formBuilder: FormBuilder,
        public configuratorHeading: ConfiguratorHeadingService
    ) {}

    public ngOnInit(): void {
        // Initializing the form
        this.form = this.formBuilder.group({
            // Note: When using the NOVA_GENERIC_CONVERTER, the form control name, in this case 'imageSource', must match the input name on
            // this component as well as that of the corresponding property on the custom widget body component.
            imageSource: [{}, [Validators.required]],
        });

        // Emitting the formReady as described above.
        this.formReady.emit(this.form);
    }

    public ngOnChanges(changes: SimpleChanges): void {
        if (changes.imageSource && !changes.imageSource.isFirstChange()) {
            const previousValue: string = changes.imageSource.previousValue;
            if (previousValue !== this.imageSource) {
                // Setting the display value according to the current imageSource value
                this.imageDisplayValue = this.imageItems.find(
                    (item: IMenuItem) => item.url === this.imageSource
                )?.title;

                // Updating the form when the imageSource input gets updated
                this.form.get("imageSource")?.setValue(this.imageSource);
            }
        }
    }

    public onChanged(newValue: string): void {
        // Keeping the display value updated as the user changes the dropdown selection
        this.imageDisplayValue = this.imageItems.find(
            (item: IMenuItem) => item.url === newValue
        )?.title;
    }
}

/**
 * The component that instantiates the dashboard
 */
@Component({
    selector: "custom-widget",
    templateUrl: "./custom-widget.component.html",
    styleUrls: ["./custom-widget.component.less"],
})
export class CustomWidgetComponent implements OnInit {
    // This variable will hold all the data needed to define the layout and behavior of the widgets.
    // Pass this to the dashboard component's dashboard input in the template.
    public dashboard: IDashboard | undefined;

    // Angular gridster requires a configuration object even if it's empty.
    // Pass this to the dashboard component's gridsterConfig input in the template.
    public gridsterConfig: GridsterConfig = {};

    // Boolean which dashboard takes in as an input if its true it allows you to move widgets around.
    public editMode: boolean = false;

    constructor(
        // WidgetTypesService provides the widget's necessary structure information
        private widgetTypesService: WidgetTypesService,

        // Inject the ComponentRegistryService to make our custom component available for late loading by the dashboards framework
        private componentRegistry: ComponentRegistryService,
        private changeDetectorRef: ChangeDetectorRef
    ) {}

    public ngOnInit(): void {
        // Register the custom widget type and custom components
        // Note: This could also be done in the parent module's constructor so that
        // multiple dashboards could have access to the same registrations.
        this.prepareNovaDashboards();

        // Register some image items as dropdown options in the widget editor/configurator
        // Note: This could also be done in the parent module's constructor so that
        // multiple dashboards could have access to the same dropdown options.
        this.registerImageOptions();

        // Initialize our current instance of a dashboard with an instance of our custom widget
        this.initializeDashboard();
    }

    /** Used for restoring widgets state */
    public reInitializeDashboard(): void {
        // destroys the components and their providers so the dashboard can re init data
        this.dashboard = undefined;
        this.changeDetectorRef.detectChanges();

        this.initializeDashboard();
    }

    public initializeDashboard(): void {
        // We're using a static configuration object for this example (see widgetConfig at the bottom of the file),
        // but this is where the widget's configuration could potentially be populated from a database
        const widget = widgetConfig;

        // Create an index of widgets complete with structure and configuration to assign to the dashboard
        const widgets: IWidgets = {
            // Complete the custom widget with structure information coming from its type definition
            [widget.id]: this.widgetTypesService.mergeWithWidgetType(widget),
        };

        // Setting the widget dimensions and position (this is for gridster)
        const positions: Record<string, GridsterItem> = {
            [widget.id]: {
                cols: 4,
                rows: 11,
                y: 0,
                x: 0,
            },
        };

        // Finally, assigning the variables we created above to the dashboard
        this.dashboard = { positions, widgets };
    }

    private prepareNovaDashboards() {
        // Register the custom widget type
        this.widgetTypesService.registerWidgetType(
            CUSTOM_WIDGET_TYPENAME,
            1,
            customWidget
        );

        // Register the custom widget body component with the component registry to make it available
        // for late loading by the dashboard framework.
        this.componentRegistry.registerByLateLoadKey(
            CustomWidgetBodyContentComponent
        );

        // Register the custom configurator section with the component registry to make it available
        // for late loading by the dashboard framework.
        this.componentRegistry.registerByLateLoadKey(
            CustomConfiguratorSectionComponent
        );
    }

    private registerImageOptions() {
        // Grab the widget's default template which will be needed as a parameter for setNode below.
        const widgetTemplate = this.widgetTypesService.getWidgetType(
            CUSTOM_WIDGET_TYPENAME,
            1
        );

        // Register some image items as dropdown options in the widget editor/configurator
        this.widgetTypesService.setNode(
            // This is the template we grabbed above with getWidgetType
            widgetTemplate,
            // We are setting the editor/configurator part of the widget template
            "configurator",
            // This indicates which node you are changing and we want to change the image items available for selection in the editor.
            // For reference, see the 'paths' property of the custom widget's IWidgetTypeDefinition at the bottom of this file.
            IMAGE_SELECTION_CONFIGURATOR_PATH_KEY,
            // We are setting the image items available for selection in the editor. 'imageItems' is defined
            // at the bottom of this file.
            imageItems
        );
    }
}

/***************************************************************************************************
 *  This is the type definition of our custom widget
 ***************************************************************************************************/
const customWidget: IWidgetTypeDefinition = {
    /***************************************************************************************************
     *  Paths to important settings in this type definition
     ***************************************************************************************************/
    paths: {
        widget: {
            [WellKnownPathKey.Root]: DEFAULT_PIZZAGNA_ROOT,
        },
        configurator: {
            [WellKnownPathKey.Root]: DEFAULT_PIZZAGNA_ROOT,
            // for the custom configuration component, this is the path for the list of image items available for selection
            [IMAGE_SELECTION_CONFIGURATOR_PATH_KEY]:
                "imageSelection.properties.imageItems",
        },
    },
    /***************************************************************************************************
     *  Widget section describes the structural part of the custom widget
     ***************************************************************************************************/
    widget: {
        [PizzagnaLayer.Structure]: {
            [DEFAULT_PIZZAGNA_ROOT]: {
                id: DEFAULT_PIZZAGNA_ROOT,
                // base layout of the widget - all components referenced herein will be stacked in a column
                componentType: StackComponent.lateLoadKey,
                providers: {
                    // When enabled, this provider emits the REFRESH event on the pizzagna event bus every X seconds
                    [WellKnownProviders.Refresher]: refresher(),
                    // event proxy manages the transmission of events between widget and dashboard such as the WIDGET_EDIT and WIDGET_REMOVE events
                    [WellKnownProviders.EventProxy]: EVENT_PROXY,
                },
                properties: {
                    // these values reference child components in the widget structure defined below
                    nodes: ["header", "loading", "body"],
                },
            },
            // standard widget header
            header: WIDGET_HEADER,
            // this is the loading bar below the header
            loading: WIDGET_LOADING,
            // the body node
            body: WIDGET_BODY,

            // retrieving the definitions for the body content nodes. the argument corresponds to the main content node key
            ...widgetBodyContentNodes("mainContent"),

            // the component that supplies the content of our custom widget
            mainContent: {
                id: "mainContent",
                componentType: CustomWidgetBodyContentComponent.lateLoadKey,
                properties: {
                    elementClass: "d-flex w-100 justify-content-center",
                },
            },
        },
        [PizzagnaLayer.Configuration]: {
            [DEFAULT_PIZZAGNA_ROOT]: {
                id: DEFAULT_PIZZAGNA_ROOT,
                providers: {
                    // default refresher configuration
                    [WellKnownProviders.Refresher]: refresher(false, 60),
                },
            },
            // default header configuration
            header: {
                properties: {
                    title: $localize`Empty Custom Widget`,
                },
            },
        },
    },
    /***************************************************************************************************
     *  Configurator section describes the form that's used to configure the widget
     ***************************************************************************************************/
    configurator: {
        [PizzagnaLayer.Structure]: {
            [DEFAULT_PIZZAGNA_ROOT]: {
                id: DEFAULT_PIZZAGNA_ROOT,
                // base layout of the configurator - all form components referenced herein will be stacked in a column
                componentType: FormStackComponent.lateLoadKey,
                properties: {
                    elementClass:
                        "flex-grow-1 overflow-auto nui-scroll-shadows",
                    // these values reference child components laid out in this form (defined below)
                    nodes: ["presentation", "customConfig"],
                },
            },
            // /presentation
            presentation: {
                id: "presentation",
                componentType: WidgetConfiguratorSectionComponent.lateLoadKey,
                properties: {
                    headerText: $localize`Presentation`,
                    nodes: ["titleAndDescription"],
                },
            },
            // /presentation/titleAndDescription
            titleAndDescription: {
                id: "titleAndDescription",
                componentType:
                    TitleAndDescriptionConfigurationComponent.lateLoadKey,
                providers: {
                    converter: {
                        providerId: NOVA_TITLE_AND_DESCRIPTION_CONVERTER,
                    } as IProviderConfiguration,
                },
            },
            // /customConfig
            customConfig: {
                id: "customConfig",
                componentType: WidgetConfiguratorSectionComponent.lateLoadKey,
                properties: {
                    headerText: $localize`Custom Widget Configuration`,
                    nodes: ["imageSelection"],
                },
            },
            // /customConfig/imageSelection
            imageSelection: {
                id: "imageSelection",
                // Here's where we set the configurator to use our custom configurator section
                componentType: CustomConfiguratorSectionComponent.lateLoadKey,
                properties: {
                    // This corresponds to the 'imageItems' input on the custom configurator section component
                    // which defines the list of image items to pick from. The empty value shown here is overridden
                    // in the 'registerImageOptions' method above.
                    imageItems: [] as IMenuItem[],
                },
                providers: {
                    // Using the generic converter to map the selected image source between the widget and the form
                    [WellKnownProviders.Converter]: {
                        providerId: NOVA_GENERIC_CONVERTER,
                        properties: {
                            formParts: [
                                {
                                    // Setting up the generic converter to update the 'imageSource' property of the custom widget 'mainContent' component
                                    previewPath: "mainContent.properties",
                                    // Note: To use the NOVA_GENERIC_CONVERTER, the linked properties must have the same name between the configurator
                                    // section component and the widget 'mainContent' component. Additionally, the property name must match the formControl
                                    // name used in the configurator section component. In this case, the common name among all three is 'imageSource'.
                                    keys: ["imageSource"],
                                },
                            ] as IConverterFormPartsProperties[],
                        },
                    } as IProviderConfiguration,
                },
            },
        },
    },
};

// For this example, we're using static items for the image selection dropdown. In a more realistic scenario,
// the items available for selection might come from a backend database.
const imageItems = [
    {
        title: "Harry Potter Book Cover",
        url: "https://imgc.allpostersimages.com/img/print/u-g-F8PQ9I0.jpg?w=550&h=550&p=0",
    },
    {
        title: "Harry Potter Movie Poster",
        url: "https://images-na.ssl-images-amazon.com/images/I/81gpmMdKOHL._AC_SY741_.jpg",
    },
] as IMenuItem[];

// We're using a static configuration object for this example. In a more realistic scenario,
// a widget's configuration would likely be stored in a database.
const widgetConfig: IWidget = {
    id: "widget1",
    // This custom type is registered in the 'prepareNovaDashboards' method above.
    type: CUSTOM_WIDGET_TYPENAME,
    pizzagna: {
        [PizzagnaLayer.Configuration]: {
            header: {
                // Setting the initial property values for the WidgetHeaderComponent
                properties: {
                    title: "Harry Potter and the Sorcerer's Stone",
                    subtitle: "By J. K. Rowling",
                },
            },
            mainContent: {
                properties: {
                    // Setting the initial value for the 'imageSource' property on our custom widget body
                    imageSource: imageItems[0].url,
                },
            },
        },
    },
};
