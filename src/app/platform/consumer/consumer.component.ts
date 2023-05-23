import { Component, OnInit } from '@angular/core';
import { takeWhile, tap } from 'rxjs/operators';
import { interval, Subject } from 'rxjs';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';

import { TableConfig } from 'src/app/shared/general-table/model';
import { ApiService } from 'src/app/services/api.service';
import { ApiResponse } from 'src/app/interfaces/response';
import { AlertService } from 'src/app/shared/alert/alert.service';
import { VAlertAction } from 'src/app/shared/alert/alert.model';
import { FORMATS } from 'src/app/shared/general-table/formats';
import { PermissionService } from 'src/app/services/check-permissions.service';
import { environment } from 'src/environments/environment';

import { CONSUMERSTATUS, CustomerTableConfig } from './config';
import { ConsumerFormComponent } from './consumer-form/consumer-form.component';
import { TotalDevicesComponent } from './total-devices/total-devices.component';
import { DeviceAllocationComponent } from '../customer/add-customer/device-allocation/device-allocation.component';


@Component({
    selector: 'app-consumer',
    templateUrl: './consumer.component.html',
    styleUrls: ['./consumer.component.scss']
})
export class ConsumerComponent implements OnInit {

    loading: boolean;
    readonly: boolean;

    config: TableConfig;
    actions: Subject<any> = new Subject();
    cardsInfo: any;

    constructor(
        private apiService: ApiService,
        private toastrService: ToastrService,
        private modal: NgbModal,
        private permService: PermissionService
    ) {
        this.loading = false;
        this.readonly = false;

        const config = JSON.parse(JSON.stringify(CustomerTableConfig.config));
        // config.rowActions.push({ icon: 'ri-delete-bin-2-line', type: 'icon', tooltip: 'Delete', action: 'onDelete', btnColor: 'btn-danger', condition: this.deleteCondition })

        this.config = new TableConfig(config);

        this.cardsInfo = {
            total_consumers: 2,
            active_consumers: 2,
            inactive_consumers: 0,
            usecase_assigned_devices: []
        };
    }

    ngOnInit(): void {
        FORMATS['consumer-status'] = CONSUMERSTATUS;
        this.checkPermission();
        this.getConsumerCardsInfo();
    }

    checkPermission() {
        let perm = this.permService.checkPermissions();
        this.readonly = perm && perm.length > 0 && perm.includes('RW') ? false : true;
    }

    scrollLeft(el: Element) {
        const animTimeMs = 400;
        const pixelsToMove = 228;
        const stepArray = [0.001, 0.021, 0.136, 0.341, 0.341, 0.136, 0.021, 0.001];
        interval(animTimeMs / 8).pipe(
            takeWhile(value => value < 8),
            tap(value => el.scrollLeft -= (pixelsToMove * stepArray[value])),
        ).subscribe();
    }

    scrollRight(el: Element) {
        const animTimeMs = 400;
        const pixelsToMove = 228;
        const stepArray = [0.001, 0.021, 0.136, 0.341, 0.341, 0.136, 0.021, 0.001];
        interval(animTimeMs / 8).pipe(
            takeWhile(value => value < 8),
            tap(value => el.scrollLeft += (pixelsToMove * stepArray[value])),
        ).subscribe();
    }

    getConsumerCardsInfo() {
        this.actions.next({action: 'loadingTrue'});
        const slug = `${environment.customerms}/consumer/consumer-and-device-count`;
        this.apiService.get(slug).subscribe((resp: ApiResponse) => {
            this.actions.next({action: 'loadingFalse'});
            this.cardsInfo = resp.data;
        }, (err: any) => {
            this.actions.next({action: 'loadingFalse'});
            const status = err.error['status'];
            const statusCodes = [401, 2, 3, 11, 151, 153, 18, 300, 301];
            if (statusCodes.includes(status)) {
                this.toastrService.error(err.error['message'], 'Access Unauthorized', {
                    progressBar: true, progressAnimation: 'decreasing', timeOut: 3000
                });
            } else {
                this.toastrService.error(err.error['message'], 'Getting error customer cards information', {
                    progressBar: true, progressAnimation: 'decreasing', timeOut: 3000
                });
            }
        });
    }

    onTableSignals(ev: any) {
        if (ev.type === 'OpenForm') {
            this.onAddNew();
        } else if (ev.type === 'onEdit') {
            this.onAddNew(ev.row);
        // } else if (ev.type === 'onDelete') {
        //     this.onDelete(ev.row);
        } else if (ev.type === 'onDetails') {
            this.onAddNew(ev.row, true);
        } else if (ev.type === 'onTotalDevices') {
            this.onTotalDevices(ev.row);
        } else if (ev.type === 'onAllocateDevices') {
            this.onAllocateDevice(ev.row);
        } else if (ev.type === 'onChangeStatus') {
            this.onChangeConsStatus(ev.row);
        }
    }

    onAddNew(ev?: any, readonly = false) {
        const modalRef = this.modal.open(ConsumerFormComponent, {size: 'sm-lg', scrollable: true});

        if (!!ev) {
            modalRef.componentInstance.title = 'Edit Consumer';
            const ph = ev.phone;
            ev['phone'] = !!ph ? ph.replace('+974', '') : '';
            modalRef.componentInstance.data = ev;
        }

        if (readonly) {
            modalRef.componentInstance.readonly = readonly;
            modalRef.componentInstance.title = 'Consumer Details';
        }

        modalRef.closed.subscribe(() => {
            this.actions.next({action: 'reload'});
            this.getConsumerCardsInfo();
        });
    }

    onTotalDevices(ev: any) {
        const modalRef = this.modal.open(TotalDevicesComponent, { size: 'md-lg', scrollable: true });

        modalRef.componentInstance.data = ev;
        modalRef.componentInstance.consumerId = ev.id;
        modalRef.componentInstance.readonly = this.readonly;

        modalRef.closed.subscribe(() => {
            this.getConsumerCardsInfo();
            this.actions.next({action: 'reload'});
        });
    }

    onAllocateDevice(row?: any) {
        const modalRef = this.modal.open(DeviceAllocationComponent, { size: 'md-lg', scrollable: true });

        modalRef.componentInstance.fromConsumer = true;
        modalRef.componentInstance.consumerId = row.id;

        modalRef.closed.subscribe(() => {
            this.getConsumerCardsInfo();
            this.actions.next({action: 'reload'});
        });
    }

    onDelete(row: any) {
        const slug = `${environment.customerms}/consumer?id=${row.id}`;
        AlertService.warn('Are you sure?', 'You want to delete this consumer', 'Yes').subscribe((resp: VAlertAction) => {
            if (resp.positive) {
                this.apiService.delete(slug).subscribe((resp: ApiResponse) => {
                    this.toastrService.success(resp.message, 'Consumer deleted successfully', {
                        progressAnimation: 'decreasing', progressBar: true, timeOut: 3000
                    });
                    this.getConsumerCardsInfo();
                    this.actions.next({action: 'reload'});
                }, (err: any) => {
                    this.toastrService.error(err.error['message'], 'Error deleting consumer', {
                        progressAnimation: 'decreasing', progressBar: true, timeOut: 3000
                    });
                });
            } else {
                return;
            }
        });
    }

    onChangeConsStatus(ev: any) {
        let status = ev.status === 1 ? 'InActive' : 'Active';
        let statusCode = status === 'InActive' ? 2 : 1;
        const slug = `${environment.customerms}/consumer/?id=${ev.id}&status=${statusCode}`;

        AlertService.warn('Are you sure?', 'You want to make this consumer ' + status, 'Yes').subscribe((resp: VAlertAction) => {
            if (resp.positive) {
                this.actions.next({action: 'loadingTrue'});
                this.apiService.delete(slug).subscribe((resp: ApiResponse) => {
                    this.toastrService.success(resp.message, 'Set consumer ' + status, {
                        progressBar: true, progressAnimation: 'decreasing', timeOut: 3000
                    });
                    this.getConsumerCardsInfo();
                    this.actions.next({action: 'reload'});
                }, (err: any) => {
                    this.actions.next({action: 'loadingFalse'});
                    this.toastrService.error(err.error['message'], 'Error setting consumer status as' + status, {
                        progressBar: true, progressAnimation: 'decreasing', timeOut: 3000
                    });
                });
            } else {
                return;
            }
        })
    }

    deleteCondition(row: any, action: any) {
        let usr: any = localStorage.getItem('user');
        let user = JSON.parse(usr);
        return user.type === 'SA' ? true : false;
    }
}
