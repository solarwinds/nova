## The Story of Pizzagna

The generic concept we decided to call 'Pizzagna' was developed as part of the design process of 
dashboards, in which we found ourselves trying to solve several problems at once using a single approach. 

Imagine a simple widget implemented using a single component in an Angular way with a configuration 
defining its type and properties, like this:
```
{
    componentType: "TableWidgetComponent",
    properties: {
        title: "My first table widget!",
        description: "Shows a list of things",
        dataSource: {
            type: "someDataSource",
            url: "http://example/things/api"
        },
        sorting: {
            sortBy: "column",
            direction: "asc"
        }
    }
}
```

We can immediately identify a few design problems here, especially:

- From the consumer point of view, the widget is a monolith, and some parts are likely duplicated in 
other widgets.
- The presence of a dataSource is hardwired into the widget.
- Data visualized by the widget is not present here (It could be passed as a separate input, but let's 
presume it's just stored inside the widget as internal state).

We'll now try to address all of these issues and see where it takes us. 

### Configuration of Separate Components 

First, let's try to break down the widget into separate components and expose the widget header and body 
to be configured separately:

```
{
    "root": {
        // layout component that organizes child nodes into a column or a row
        componentType: "StackComponent",
        properties: {
            // here we reference other components as 'nodes'
            nodes: ["header", "table"],
            // Default stacking direction is 'column'.
            direction: "column"
        }
    },
    "header": {
        componentType: "WidgetHeaderComponent",
        properties: {
            // the 'title' and 'description' fields are now owned by the header
            title: "My first table widget!",
            description: "Shows a list of things",
        }
    },
    "table": {
        componentType: "TableWidgetComponent",
        properties: {
            dataSource: {
                type: "someDataSource",
                url: "http://example/things/api"
            },
            sorting: {
                sortBy: "column",
                direction: "asc"
            }
        }
    }
}
```

This structure enables the replacement of individual components without affecting the rest, which is a 
step in the right direction.

### Providers

Now let's address the presence of the hard-coded data source. To generalize the concept of a data source, 
we figured that it would work best if we could have any number of instantiated injectables we call
'providers' which can provide any behavior. The idea of a data source definitely fits in this picture, 
since all it does is expose the ability to be invoked and provide data through an observable output. For 
the sake of simplicity, let's ignore some currently irrelevant details and try to configure the table 
component to instantiate a data source like this:
   
```
[
    ...
    "table": {
        componentType: "TableWidgetComponent",
        providers: {
            dataSource: {
                // this id references a provider definition that's registered under this id
                providerId: "someDataSource",
                properties: {
                    url: "http://example/things/api"
                }
            },
        },
        properties: {
            sorting: {
                sortBy: "column",
                direction: "asc"
            }
        }
    }
]
```

### Data

The configuration structure now describes how to build the whole widget, but we'll also need a way to 
specify the data we want to display. We could of course use a different means for this, but why not be
consistent and use the same mechanism as before? Let's extend the component properties to pass the data 
in and voila - we're done! 

```
[
    ...
    "table": {
        componentType: "TableWidgetComponent",
        providers: {
            dataSource: {
                providerId: "someDataSource",
                properties: {
                    url: "http://example/things/api"
                }
            },
        },
        properties: {
            // ---> the data is now being passed through a property as well
            items: [...],
            sorting: {
                sortBy: "column",
                direction: "asc"
            }
        }
    }
]
```

### Layers

We're getting closer to the final idea of building configuration-based UIs. But, there's one final 
important step we have to take. Looking at the state of configuration, so far we currently have all of it
in a single data structure. This makes it difficult to distinguish the different possible origins and 
purposes of properties.

Pizzagna can contain any number of layers, but we currently just use 3 layers:

 - `structure`: defines the structure of a widget, i.e. what components the widget consists of and their 
initial setup.
 - `configuration`: defines the storable configuration for a widget instance--things such as title, data 
source, property values, etc.
 - `data`: defines the transient state of a widget as it's displayed in the browser--includes displayed
data as well as other transient properties that are not intended to be persisted anywhere.

### Pizzagna Service

There is an important design pattern that needs to be respected at all times--the rule of one-way data flow.
If you want to display something dynamic in widgets, it has to come through the Pizzagna. 
Of course, there will be times when the widget components themselves need to initiate changes in the 
Pizzagna, and in those cases we'll want to use the 
[`PizzagnaService`](../../injectables/PizzagnaService.html). In the same way we would use outputs in a 
regular Angular component to initiate a change, we'll use the Pizzagna Service to initiate a 
component-originating change in the Pizzagna.

First, inject the service into your component:

```
constructor(private pizzagnaService: PizzagnaService) { }
```

Then, use it to modify the value:

```
this.pizzagnaService.setProperty({
        pizzagnaKey: PizzagnaLayer.Data, // the layer we're working on 
        componentId: this.componentId, // the component that's changing the property
        propertyPath: ["sorterConfiguration"], // the path to the property in the Pizzagna
    },
    value // value to be set
); 
```

The value will arrive at the target component as a regular input value with `ngOnChanges` being invoked 
as well.

### The Name "Pizzagna"

In concrete terms, Pizzagna is the JSON-based configuration described above as well as the
service that orchestrates changes in configuration and data sources. The (cheeky) name,
as you might have already guessed, is a combination of "pizza" and "lasagna", where "lasagna"
refers to the layer concept and "pizza" refers to the horizontal subdivision into individual 
components.

This configuration-driven approach allows us to ensure that the entire state of the dashboard is
serializable at any time - which makes it trivial for developers to persist that state, and restore
it as necessary.
