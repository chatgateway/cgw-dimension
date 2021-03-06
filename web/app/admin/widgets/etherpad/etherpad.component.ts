import { Component } from "@angular/core";
import { FE_EtherpadWidget } from "../../../shared/models/integration";
import { ToasterService } from "angular2-toaster";
import { DialogRef, ModalComponent } from "ngx-modialog";
import { WidgetConfigDialogContext } from "../widgets.component";
import { AdminIntegrationsApiService } from "../../../shared/services/admin/admin-integrations-api.service";

@Component({
    templateUrl: "./etherpad.component.html",
    styleUrls: ["./etherpad.component.scss", "../config-dialog.scss"],
})
export class AdminWidgetEtherpadConfigComponent implements ModalComponent<WidgetConfigDialogContext> {

    public isUpdating = false;
    public widget: FE_EtherpadWidget;
    private originalWidget: FE_EtherpadWidget;

    constructor(public dialog: DialogRef<WidgetConfigDialogContext>, private adminIntegrationsApi: AdminIntegrationsApiService, private toaster: ToasterService) {
        this.originalWidget = dialog.context.widget;
        this.widget = JSON.parse(JSON.stringify(this.originalWidget));
    }

    public save() {
        this.isUpdating = true;
        this.adminIntegrationsApi.setIntegrationOptions(this.widget.category, this.widget.type, this.widget.options).then(() => {
            this.originalWidget.options = this.widget.options;
            this.toaster.pop("success", "Widget updated");
            this.dialog.close();
        }).catch(err => {
            this.isUpdating = false;
            console.error(err);
            this.toaster.pop("error", "Error updating widget");
        });
    }
}
