import { DOCUMENT } from "@angular/common";
import { Component, Inject, OnDestroy, Renderer2, RendererFactory2, ViewEncapsulation } from "@angular/core";

@Component({
    selector: "custom-theme-example",
    templateUrl: "./custom-theme.example.component.html",
    styleUrls: ["./custom-theme.example.component.less"],
    encapsulation: ViewEncapsulation.None,
})
export class CustomThemeExampleComponent implements OnDestroy {
    private readonly renderer: Renderer2;
    private readonly containerElement: Element;
    private readonly customClassName = "clown-party-theme";

    // Inject the RendererFactory2 for manipulating the DOM and inject the document for manipulation
    constructor(rendererFactory: RendererFactory2, @Inject(DOCUMENT) document: Document) {
        // Get the root html element
        this.containerElement = document.children[0];
        // Create a renderer instance
        this.renderer = rendererFactory.createRenderer(null, null);
    }

    ngOnDestroy() {
        // cleanup
        this.renderer.removeClass(this.containerElement, this.customClassName);
    }

    public setTheme(value: boolean) {
        // add/remove the custom class to the root html element based on the switch's value
        this.renderer[value ? "addClass" : "removeClass"](this.containerElement, this.customClassName);
    }
}
