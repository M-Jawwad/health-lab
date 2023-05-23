import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { ApiResponse } from 'src/app/interfaces/response';
import { ApiService } from 'src/app/services/api.service';
import { PermissionService } from 'src/app/services/check-permissions.service';
import { VAlertAction } from 'src/app/shared/alert/alert.model';
import { AlertService } from 'src/app/shared/alert/alert.service';
import { TableConfig } from 'src/app/shared/general-table/model';
import { environment } from 'src/environments/environment';
import { SensorsFormComponent } from '../sensors-features-form/sensors-features-form.component';
import { DeviceTypesTableConfig } from './config';


@Component({
    selector: 'app-sensors-configuration',
    templateUrl: './sensors-configuration.component.html',
    styleUrls: ['./sensors-configuration.component.scss']
})
export class SensorsConfigurationComponent implements OnInit {
    loading: boolean;
    readonly: boolean;
    config: TableConfig;
    data: any;

    actions: Subject<any> = new Subject()

    constructor(
        private apiService: ApiService,
        private toastrService: ToastrService,
        private modal: NgbModal,
        private checkPermService: PermissionService
    ) {
        this.loading = false;
        this.readonly = false;

        this.config = new TableConfig(DeviceTypesTableConfig.config);
    }

    ngOnInit(): void {
    }

    onTableSignals(ev: any) {
        if (ev.type === 'OpenForm') {
            this.addNew();
        } else if (ev.type === 'onEdit') {
            this.addNew(ev);
        } else if (ev.type === 'onDelete') {
            this.deleteSensor(ev.row);
        }
    }

    reloadTable() {
        this.actions.next({action: 'reload'})
    }

    addNew(ev?: any) {
        const modalRef = this.modal.open(SensorsFormComponent, {size: 'sm', scrollable: true});

        if (!!ev) {
            modalRef.componentInstance.title = 'Edit Sensor & Feature';
            modalRef.componentInstance.data = ev.row;
        }

        modalRef.closed.subscribe((res) => {
            this.reloadTable();
        });
    }

    deleteSensor(ev: any) {
        let slug = `${environment.inventoryms}/sensor-configuration/?id=${ev.id}`;
        AlertService.confirm('Are you sure?', 'You want to delete this sensor?', 'Yes').subscribe((resp: VAlertAction) => {
            if (resp.positive) {
                this.apiService.delete(slug).subscribe((resp: ApiResponse) => {
                    this.toastrService.success(resp.message, 'Success', {
                        progressBar: true, progressAnimation: 'decreasing', timeOut: 3000
                    });
                    this.reloadTable();
                }, (err: any) => {
                    this.toastrService.error(err.error['message'], 'Error deleting feature', {
                        progressBar: true, progressAnimation: 'decreasing', timeOut: 3000
                    });
                });
            } else {
                return;
            }
        });
    }
}
