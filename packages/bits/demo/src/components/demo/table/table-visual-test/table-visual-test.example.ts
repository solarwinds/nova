import { Component } from "@angular/core";

@Component({
    selector: "table-visual-test-example",
    templateUrl: "./table-visual-test.example.html",
})
export class TableVisualTestComponent {
    public sortingTableCode =
`this.dataSourceService.componentTree = {
    sorter: {
        componentInstance: this.sortableTable,
    },
 }`;
    public alignmentCode =
`<td nui-cell *nuiCellDef="let element">
     <div class="custom-class">
         {{element.status}}
     </div>
 </td>`;
}
