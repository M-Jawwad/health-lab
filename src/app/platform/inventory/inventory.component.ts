import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';

import { TableConfig } from 'src/app/shared/general-table/model';
import { AllocatedDevicesTableConfig, AvailableDevicesTableConfig, DeactivateDevicesTableConfig, FaultyDevicesTableConfig, InventoryTableConfig, SoldDevicesTableConfig } from './config';
import { InventoryFormComponent } from './inventory-form/inventory-form.component';
import { DeviceHistoryComponent } from './device-history/device-history.component';
import { ApiService } from 'src/app/services/api.service';
import { ApiResponse } from 'src/app/interfaces/response';
import { Subject } from 'rxjs';
import { FormControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { FORMATS } from 'src/app/shared/general-table/formats';
import { STATUS } from './formats';
import { AlertService } from 'src/app/shared/alert/alert.service';
import { VAlertAction } from 'src/app/shared/alert/alert.model';
import { ConsumerFormComponent } from '../consumer/consumer-form/consumer-form.component';
import { BulkUploadComponent } from './bulk-upload/bulk-upload.component';
import { environment } from 'src/environments/environment';
import { DiagnosticsComponent } from '../device-diagnostic/diagnostics/diagnostics.component';


@Component({
    selector: 'app-inventory',
    templateUrl: './inventory.component.html',
    styleUrls: ['./inventory.component.scss']
})
export class InventoryComponent implements OnInit {

    @ViewChild('scrollMe') myScrollContainer!: ElementRef;

    loading: boolean;
    readonly: boolean;
    
    config: TableConfig;
    devicesConfig: TableConfig;
    allocatedDevicesConfig: TableConfig;
    soldDevicesConfig: TableConfig;
    deactivateddevicesConfig: TableConfig;
    faultyDevicesConfig: TableConfig;
    
    activeId: string;

    packages: any[];
    activePackage: any = null;
    package: FormControl;

    actions: Subject<any> = new Subject();
    devicesStatusesCount: any = null;

    constructor(
        private apiService: ApiService,
        private router: Router,
        private toastrService: ToastrService,
        private modal: NgbModal
    ) {
        this.config = new TableConfig();
        this.devicesConfig = new TableConfig();
        this.allocatedDevicesConfig = new TableConfig();
        this.soldDevicesConfig = new TableConfig();
        this.deactivateddevicesConfig = new TableConfig();
        this.faultyDevicesConfig = new TableConfig();

        this.loading = false;
        this.readonly = false;

        this.activeId = 'inventory';

        this.package = new FormControl(null);

        this.packages = [];
    }

    ngOnInit(): void {
        this.config = new TableConfig(InventoryTableConfig.config);
        this.devicesConfig = new TableConfig(AvailableDevicesTableConfig.config);
        this.allocatedDevicesConfig = new TableConfig(AllocatedDevicesTableConfig.config);
        this.soldDevicesConfig = new TableConfig(SoldDevicesTableConfig.config);
        this.deactivateddevicesConfig = new TableConfig(DeactivateDevicesTableConfig.config);
        this.faultyDevicesConfig = new TableConfig(FaultyDevicesTableConfig.config);
        
        this.getPackages();

        this.package.valueChanges.pipe(debounceTime(400), distinctUntilChanged()).subscribe((value) => {
            this.activePackage = value;
            this.config.slug = `${environment.inventoryms}/inventory/?package=${value}&`;
            this.devicesConfig.slug = `${environment.inventoryms}/inventory/?status=1&package=${value}&`;
            this.allocatedDevicesConfig.slug = `${environment.inventoryms}/inventory/?status=2&package=${value}&`;
            this.soldDevicesConfig.slug = `${environment.inventoryms}/inventory/?status=3&package=${value}&`;
            this.deactivateddevicesConfig.slug = `${environment.inventoryms}/inventory/?status=4&package=${value}&`;
            this.faultyDevicesConfig.slug = `${environment.inventoryms}/inventory/?status=5&package=${value}&`;
            
            this.getInventoryCards(value);
            this.config.doApiCall = true;
            this.actions.next({action: 'reload'});
        });

        this.defineFormats();
    }

    defineFormats() {
        FORMATS['status'] = STATUS;
    }

    getPackages() {
        this.actions.next({action: 'loadingTrue'});
        let slug = `${environment.inventoryms}/inventory-common/get-usecase-package`;
        this.apiService.get(slug).subscribe((resp: ApiResponse) => {
            this.packages = resp.data['data'];
            this.packages.unshift({id: 'all', display_name: 'All'})
            this.package.setValue(this.packages[0].id);
        }, (err: any) => {
            this.actions.next({action: 'loadingFalse'});
            const status = err.error['status'];
            const statusCodes = [401, 2, 3, 11, 151, 153, 18, 300, 301];
            if (statusCodes.includes(status)) {
                this.toastrService.error(err.error['message'], 'Access Unauthorized', {
                    progressBar: true, progressAnimation: 'decreasing', timeOut: 3000
                });
            } else {
                this.toastrService.error(err.error['message'], 'Error getting packages', {
                    progressBar: true, progressAnimation: 'decreasing', timeOut: 3000
                });
            }
        });
    }

    getInventoryCards(ev?: any) {
        this.actions.next({action: 'loadingTrue'});
        const slug = `${environment.inventoryms}/inventory/get-inventory-cards-v2?package=${ev}`;
        this.apiService.get(slug).subscribe((resp: ApiResponse) => {
            this.devicesStatusesCount = resp.data['data'];
        }, (err: any) => {
            this.actions.next({action: 'loadingFalse'});
            this.toastrService.error(err.error['message'], 'Error getting inventory statuses', {
                progressBar: true, progressAnimation: 'decreasing', timeOut: 3000
            });
        });
    }

    scrollToBottom(activeId: string): void {
        this.getInventoryCards(this.activePackage);
        this.activeId = activeId;
        this.myScrollContainer.nativeElement.scrollIntoView({ behavior: "smooth", block: "start" });
    }

    onSelectTab(id: string) {
        this.activeId = id;
        this.getInventoryCards(this.activePackage);
    }

    onTableSignals(ev: any) {
        if (ev.type === 'OpenForm') {
            this.onAddNew();
        } else if (ev.type === 'onOptionalBtn') {
            this.onBulkUpload(ev);
        } else if (ev.type === 'onEdit') {
            this.onAddNew(ev);
        } else if (ev.type === 'onCustomerDetails') {
            if (ev.row['customer_type'] === 'EBU') {
                this.router.navigate(['admin/customers/details', ev.row['customer_id']]);
            } else {
                this.showConsumerDetails(ev.row);
            }
        } else if (ev.type === 'onShowHistory') {
            this.showHistory(ev);
        } else if (ev.type === 'onDelete') {
            this.onDelete(ev.row);
        } else if (ev.type === 'onDeviceId') {
            this.onDeviceDiagnostic(ev.row);
        }
    }

    onAddNew(ev?: any) {
        const modalRef = this.modal.open(InventoryFormComponent, {size: 'lg', scrollable: true});

        if (!!ev) {
            modalRef.componentInstance.data = ev.row;
            modalRef.componentInstance.title = 'Edit Device';
        }

        modalRef.closed.subscribe(() => {
            this.getInventoryCards(this.activePackage);
            this.actions.next({action: 'reload'});
        });
    }

    showHistory(ev?: any) {
        const modalRef = this.modal.open(DeviceHistoryComponent, {size: 'md', scrollable: true});
        if (!!ev) {
            modalRef.componentInstance.data = ev.row;
        }
    }

    onDelete(ev: any) {
        AlertService.confirm('Are you sure?', 'You want to delete this device', 'Yes').subscribe((resp: VAlertAction) => {
            if (resp.positive) {
                this.actions.next({action: 'loadingTrue'});
                const slug = `${environment.inventoryms}/inventory/?id=${ev.id}`;

                this.apiService.delete(slug).subscribe((resp: ApiResponse) => {
                    this.toastrService.success(resp.message, 'Device deleted successfully', {
                        progressBar: true, progressAnimation: 'decreasing', timeOut: 3000
                    });
                    this.actions.next({action: 'reload'});
                }, (err: any) => {
                    this.actions.next({action: 'loadingFalse'});
                    this.toastrService.error(err.error['message'], 'Error deleting this device', {
                        progressBar: true, progressAnimation: 'decreasing', timeOut: 3000
                    });
                });
            } else {
                return;
            }
        });
    }

    showConsumerDetails(ev: any) {
        const dialogRef = this.modal.open(ConsumerFormComponent, {size: 'sm-lg', scrollable: true});

        dialogRef.componentInstance.consumerId = ev.customer_id;
        dialogRef.componentInstance.fromInventory = true;
        dialogRef.componentInstance.readonly = true;
        dialogRef.componentInstance.title = 'Consumer Details';
    }

    onDeviceDiagnostic(ev: any) {
        const modalRef = this.modal.open(DiagnosticsComponent, {size: 'md', scrollable: true});

        modalRef.componentInstance.title = ev.device_type_name;
        modalRef.componentInstance.deviceType = ev.device_type_name;
        modalRef.componentInstance.data = ev;
        // if (ev.device_type_name === 'Concox Qbit') {
        //     const modalRef = this.modal.open(ConcoxQbitComponent, {size: 'md', scrollable: true});
    
        //     modalRef.componentInstance.title = ev.device_type_name;
        //     modalRef.componentInstance.data = ev;
        // } else if (ev.device_type_name === 'HN v1.0') {
        //     const modalRef = this.modal.open(HNV1Component, {size: 'md', scrollable: true});
    
        //     modalRef.componentInstance.title = ev.device_type_name;
        //     modalRef.componentInstance.data = ev;
        // } else if (ev.device_type_name === 'HN v1.5') {
        //     const modalRef = this.modal.open(HNV15Component, {size: 'md', scrollable: true});
    
        //     modalRef.componentInstance.title = ev.device_type_name;
        //     modalRef.componentInstance.data = ev;
        // } else {
        //     return;
        // }
    }

    onBulkUpload(ev: any) {
        const modalRef = this.modal.open(BulkUploadComponent, { size: 'md', scrollable: true });

        modalRef.closed.subscribe(() => {
            this.actions.next({action: 'reload'});
        });
    }
}
