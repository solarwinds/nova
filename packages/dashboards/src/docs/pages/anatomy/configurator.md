# Configurator

The Configurator refers to the form that pops up in the sidebar as you try to edit / create a widget.
It's built around the very same concept as the widgets (i.e. Pizzagna) and is integrally linked to two things:

- the widget **_type_** being edited/created
- the [data source](./anatomy/data-sources.html) that feeds the widget

A particular widget type will consist of the same data-configuration across different products/features. For example,
a table widget will always require the end-user to identify a set of columns to display, as well as a data type per column.
However, different **_sources_** of data require that the Configurator be highly customizable. For example, an Orion
product may want to expose a SWIS-based data source that allows the end-user to type in a SWQL query. On the other hand,
a standalone or AppMan product may wish to expose a list of RESTful endpoints from which the end-user can choose. Consequently,
the Configurator is both pluggable and overrideable.

## Form Parts

The form consists of independent parts that are visualized as accordions with expandable items containing
specific form input fields. This structure is common to all the forms, but it's by no means enforced.
Pizzagna is used to define the tree hierarchy of all these pieces, so any customization can be performed
including extending or replacing the form parts provided by the standard widget type definitions.

## Configurator Layout

![Configurator Layout](https://cp.solarwinds.com/rest/gliffy/1.0/embeddedDiagrams/02455210-f953-4622-98dd-7c4be3ff1330.png)

## Converters

To transform data between the widget and the form, we leverage the concept of providers. Since the job
of our providers is more focused than the standard Angular providers, we refer to them as "converters".
With every form, we register a converter that hooks up to the form of the related component.
The converter then propagates the form changes to the widget. On initial form load, a converter also
collects information from the widget itself to populate the form.

An example of converter configuration might look something like this:

```json
// this demonstrates a theoretical form piece configuration
"someNodeId": {
    "id": "someNodeId",
    componentType: ,
    "providers": {
        // this is where the converter is assigned
        "converter": {
            providerId: "AcmeSomethingConverter",
        },
    },
},
```

As you can see it's just another provider. It can be a generic configured to transfer properties to
specific paths or a specialized implementation. Check out the widget types specifications for examples.

## nuiWidgetEditor Directive

The configurator is an independent entity that can be invoked on its own without any dashboard
dependency. However, there is a clear relationship between them, so that's where the
[`nuiWidgetEditor`](../../directives/WidgetEditorDirective.html) directive enters.

In a world where this directive didn't exist, we'd have to subscribe to the
[`WIDGET_EDIT`](../../miscellaneous/variables.html#WIDGET_EDIT) event that is emitted after the widget's
edit menu item is activated and use the widget editor service to open the configurator with the correct
settings. Then, we'd have to wait for the form submit result coming from the main widget configuration
form, at which point we'd try to persist the widget in our storage. If persistence succeeded, we'd need
to close the configurator and update the widget on the dashboard.

Thankfully, all of this is taken care of by the directive, so if you're ok with the functionality the
directive provides, just place it on the dashboard component in the template and you're done.
