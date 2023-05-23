import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { interval, Subject } from 'rxjs';
import { takeWhile, tap } from 'rxjs/operators';

import { ToastrService } from 'ngx-toastr';

import { PermissionService } from 'src/app/services/check-permissions.service';
import { ApiResponse } from 'src/app/interfaces/response';
import { TableConfig } from 'src/app/shared/general-table/model';
import { AlertService } from 'src/app/shared/alert/alert.service';
import { VAlertAction } from 'src/app/shared/alert/alert.model';
import { ApiService } from 'src/app/services/api.service';
import { environment } from 'src/environments/environment';
import { CustomerTableConfig } from './config';


@Component({
    selector: 'app-customer',
    templateUrl: './customer.component.html',
    styleUrls: ['./customer.component.scss']
})
export class CustomersComponent implements OnInit {

    loading: boolean;
    readonly: boolean;
    showFilters: boolean;

    count: number;

    config: TableConfig;
    actions: Subject<any> = new Subject();

    cardsInfo: any;

    constructor(
        private checkPermService: PermissionService,
        private router: Router,
        private apiService: ApiService,
        private toastrService: ToastrService,
    ) {
        this.loading = false;
        this.readonly = false;
        this.showFilters = false;
        this.count = 0;

        const config = JSON.parse(JSON.stringify(CustomerTableConfig.config));
        // config.rowActions.push({ icon: 'ri-delete-bin-2-line', type: 'icon', tooltip: 'Delete', action: 'onDelete', btnColor: 'btn-danger', condition: this.deleteCondition })

        this.config = new TableConfig(config);
        this.cardsInfo = {
            total_customers: 14,
            active_customers: 10,
            inactive_customers: 4,
            subscriptions: []
        };
    }

    ngOnInit(): void {
        this.checkPermission();
        this.getCustomerCardsInfo();
        // FORMATS['ovals'] = OVALS;
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

    getCustomerCardsInfo() {
        // this.actions.next({ action: 'loadingTrue' });
        const slug = `${environment.customerms}/customers/get-customer-usecase-subscription-count`;
        this.apiService.get(slug).subscribe((resp: ApiResponse) => {
            // this.actions.next({ action: 'loadingFalse' });
            this.cardsInfo = resp.data;
        }, (err: any) => {
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
            // this.actions.next({ action: 'loadingFalse' });
        });
    }

    onTableSignals(ev: any) {
        if (ev.type === 'OpenForm') {
            this.onAddNew();
        } else if (ev.type === 'onData') {
            this.count = ev.data['count'];
        } else if (ev.type === 'onEdit') {
            this.onEdit(ev.row);
        // } else if (ev.type === 'onDelete') {
        //     this.onDelete(ev.row);
        } else if (ev.type === 'onDetails') {
            this.router.navigate(['/admin/customers/details', ev.row['id']])
        } else if (ev.type === 'onChangeStatus') {
            this.changeCustomerStatus(ev.row);
        }
    }

    checkPermission() {
        let perm = this.checkPermService.checkPermissions();
        this.readonly = perm && perm.length > 0 && perm.includes('RW') ? false : true;
    }

    onAddNew(ev?: any) {
        this.router.navigateByUrl('/admin/customers/add');
    }

    onEdit(ev: any) {
        this.router.navigate(['/admin/customers/edit', ev.id])
    }

    changeCustomerStatus(ev: any) {
        let status = ev.customer_status === 'Active' ? 'InActive' : 'Active';
        let statusCode = status === 'InActive' ? 2 : 1;
        const slug = `${environment.customerms}/customers/?id=${ev.id}&status=${statusCode}`;

        AlertService.warn('Are you sure?', 'You want to make this customer ' + status, 'Yes').subscribe((resp: VAlertAction) => {
            if (resp.positive) {
                this.apiService.delete(slug).subscribe((resp: ApiResponse) => {
                    this.toastrService.success(resp.message, 'Set customer ' + status, {
                        progressBar: true, progressAnimation: 'decreasing', timeOut: 3000
                    });
                    this.actions.next({ action: 'reload' });
                    this.getCustomerCardsInfo();
                }, (err: any) => {
                    this.toastrService.error(err.error['message'], 'Error setting customer status as' + status, {
                        progressBar: true, progressAnimation: 'decreasing', timeOut: 3000
                    });
                });
            } else {
                return;
            }
        })
    }

    // deleteCondition(row: any, action: any) {
    //     let usr: any = localStorage.getItem('user');
    //     let user = JSON.parse(usr);
    //     return user.type === 'SA' ? true : false;
    // }
}
