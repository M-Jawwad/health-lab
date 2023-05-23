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
import { ImageViewerComponent } from 'src/app/shared/image-viewer/image-viewer.component';
import { environment } from 'src/environments/environment';
import { DeviceTypeFormComponent } from '../device-type-form/device-type-form.component';
import { DeviceTypesTableConfig } from './config';


@Component({
    selector: 'app-device-types',
    templateUrl: './device-types.component.html',
    styleUrls: ['./device-types.component.scss']
})
export class DeviceTypesComponent implements OnInit {
    loading: boolean;
    readonly: boolean;
    config: TableConfig;

    deviceTypes: any[];
    actions: Subject<any> = new Subject();

    constructor(
        private apiService: ApiService,
        private toastrService: ToastrService,
        private modal: NgbModal,
        private checkPermService: PermissionService
    ) {
        this.loading = false;
        this.readonly = false;

        this.config = new TableConfig(DeviceTypesTableConfig.config);

        this.deviceTypes = [];
    }

    ngOnInit(): void {
    }

    onTableSignals(ev: any) {
        if (ev.type === 'OpenForm') {
            this.addNew();
        } else if (ev.type === 'onEdit') {
            this.addNew(ev);
        } else if (ev.type === 'onDelete') {
            this.onDelete(ev.row);
        } else if (ev.type === 'showDetails') {
            this.addNew(ev);
        } else if (ev.type === 'onView') {
            this.onDataSheet(ev.row);
        }
    }

    onDataSheet(row: any) {
        const modalRef = this.modal.open(ImageViewerComponent, {size: 'md', scrollable: true});

        modalRef.componentInstance.imgSource = row.device_data_sheet;
        modalRef.componentInstance.title = 'Data Sheet';
    }

    addNew(ev?: any) {
        const modalRef = this.modal.open(DeviceTypeFormComponent, {size: 'lg', scrollable: true});

        if (!!ev) {
            modalRef.componentInstance.title = ev.type === 'onEdit' ? 'Edit device type' : 'Device Type Details';
            modalRef.componentInstance.data = ev.row;
            modalRef.componentInstance.readonly = ev.type === 'showDetails' ? true : false;
        }

        modalRef.closed.subscribe(() => {
            this.actions.next({action: 'reload'});
        })
    }

    onDelete(row: any) {
        const slug = `${environment.inventoryms}/device-types/?id=${row.id}`;

        AlertService.confirm('Are you sure?', 'You want to delete this device type', 'Yes').subscribe((resp: VAlertAction) => {
            if (resp.positive) {
                this.apiService.delete(slug).subscribe((resp: ApiResponse) => {
                    this.toastrService.success(resp.message, 'Successfully deleted', {
                        progressBar: true, progressAnimation: 'decreasing', timeOut: 3000
                    });
                    this.actions.next({action: 'reload'});
                }, (err: any) => {
                    this.toastrService.error(err.error['message'], 'Error deleting device type', {
                        progressBar: true, progressAnimation: 'decreasing', timeOut: 3000
                    });
                });
            } else {
                return;
            }
        });
    }
}
