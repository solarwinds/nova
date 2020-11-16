# Anatomy Overview

The Nova Dashboards framework was built upon a couple of special requirements: 

- Consumers must have the ability to change the behavior, appearance, and/or functionality of existing 
widgets without breaking the bond with existing framework-provided functionality.
- Satisfaction of product-specific requirements can be achieved by swapping out, removing, or adding the 
smallest piece necessary without having to rewrite an entire section of the framework.

Beyond the requirements, the framework strives to follow the paradigm of pure Angular components that adhere 
to the following important tenets:

- one-way data flow
- on-demand serializable state
- centralized, event-based communication

The diagrams below outline the main architectural players and their relationships to one another. You can also
dive a little deeper on the [Pizzagna](./anatomy/pizzagna.html), [Configurator](./anatomy/configurator.html) 
and [Data Sources](./anatomy/data-sources.html) topics.

## Basic Dashboard Architecture
![Basic Dashboard Architecture](https://cp.solarwinds.com/rest/gliffy/1.0/embeddedDiagrams/5c9c6a7a-5494-4a30-9dd5-35c20c16abe7.png)

## Dashboard Layout
![Dashboard Layout](https://cp.solarwinds.com/rest/gliffy/1.0/embeddedDiagrams/5fc19faf-ef65-44cf-9962-aa6332160042.png)

## Basic Configurator Architecture
![Basic Configurator Architecture](https://cp.solarwinds.com/rest/gliffy/1.0/embeddedDiagrams/a330cc42-509b-4905-8845-30da8156b124.png)

## Configurator Layout
![Configurator Layout](https://cp.solarwinds.com/rest/gliffy/1.0/embeddedDiagrams/02455210-f953-4622-98dd-7c4be3ff1330.png)