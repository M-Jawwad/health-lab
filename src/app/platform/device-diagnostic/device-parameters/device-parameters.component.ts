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
import { ParametersFormComponent } from '../parameters-form/parameters-form.component';
import { DeviceParametersTableConfig } from './config';


@Component({
    selector: 'app-device-parameters',
    templateUrl: './device-parameters.component.html',
    styleUrls: ['./device-parameters.component.scss']
})
export class DeviceParametersComponent implements OnInit {

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

        this.config = new TableConfig(DeviceParametersTableConfig.config);
    }

    ngOnInit(): void {
    }

    onTableSignals(ev: any) {
        if (ev.type === 'OpenForm') {
            this.addParameter();
        } else if (ev.type === 'onEdit') {
            this.addParameter(ev);
        } else if (ev.type === 'onDelete') {
            this.deleteParameter(ev.row);
        }
    }

    addParameter(ev?: any) {
        const modalRef = this.modal.open(ParametersFormComponent, { size: 'sm', scrollable: true });

        if (!!ev) {
            modalRef.componentInstance.title = 'Edit Parameter';
            modalRef.componentInstance.data = ev.row;
        }

        modalRef.closed.subscribe((res) => {
            this.actions.next({ action: 'reload' });
            this.getDeviceTypes();
        });
    }

    getDeviceTypes() {
        const slug = `${environment.inventoryms}/device-types/?offset=0&limit=100`;
        this.apiService.get(slug).subscribe();
    }

    deleteParameter(ev: any) {
        let slug = `${environment.ddms}/device-diagnostic/parameters?id=${ev.id}`;
        AlertService.confirm('Are you sure?', 'You want to delete this parameter?', 'Yes').subscribe((resp: VAlertAction) => {
            if (resp.positive) {
                this.apiService.delete(slug).subscribe((resp: ApiResponse) => {
                    this.toastrService.success(resp.message, 'Success', {
                        progressBar: true, progressAnimation: 'decreasing', timeOut: 3000
                    });
                    this.actions.next({ action: 'reload' });
                }, (err: any) => {
                    this.toastrService.error(err.error['message'], 'Error deleting parameter', {
                        progressBar: true, progressAnimation: 'decreasing', timeOut: 3000
                    });
                });
            } else {
                return;
            }
        });
    }

}