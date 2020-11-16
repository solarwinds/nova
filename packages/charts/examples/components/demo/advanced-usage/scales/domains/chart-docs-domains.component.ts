import { Component } from "@angular/core";

@Component({
    selector: "nui-chart-docs-domains",
    templateUrl: "./chart-docs-domains.component.html",
})
export class ChartDocsDomainsComponent {
    public fixedDomainExplicit = `const bandScale = new BandScale();
bandScale.domain(["John", "Paul", "George", "Ringo"]);
bandScale.isDomainFixed = true;
...`;

    public continuousDomain = `[0, 100]`;
    public ordinalDomain = `["John", "Paul", "George", "Ringo"]`;

    public disablingFixedDomain = `scale.isDomainFixed = false;
...`;

    public fixedDomainShorthand = `const scale = new LinearScale();
scale.fixDomain([0, 100]);
...`;

    public automaticDomainWithIncludedInterval = `this.scales.y.domainCalculator = getAutomaticDomainWithIncludedInterval([0, 100]);
...`;
}
