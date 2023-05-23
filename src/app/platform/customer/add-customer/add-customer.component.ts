import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ApiResponse } from 'src/app/interfaces/response';
import { ApiService } from 'src/app/services/api.service';
import { environment } from 'src/environments/environment';


@Component({
    selector: 'app-add-customer',
    templateUrl: './add-customer.component.html',
    styleUrls: ['./add-customer.component.scss']
})
export class CustomerFormComponent implements OnInit {
    tabs: any[];
    customerId: number;
    loading: boolean;
    readonly: boolean;
    activeId: string;
    data: any = null;

    constructor(
        private activatedRoute: ActivatedRoute,
        private apiService: ApiService,
        private toastrService: ToastrService,
    ) {
        this.loading = false;
        this.readonly = false;
        this.customerId = 0;
        this.activeId = 'gd';
        this.tabs = [
            { name: 'General Details', disabled: false },
            { name: 'Upload Documents', disabled: true },
            { name: 'Packages', disabled: true },
            { name: 'Features', disabled: true },
            { name: 'Admins List', disabled: true },
            { name: 'Hardware', disabled: true },
            { name: 'Hardware Installation', disabled: true },
        ];

        this.activatedRoute.params.subscribe((params: any) => {
            this.customerId = params['id'];
        });

        this.activatedRoute.url.subscribe(value => {
            let url = value[0].path;
            this.readonly = url === 'details' ? true : false;
        });
    }

    ngOnInit(): void {
        if (this.customerId > 0) {
            this.getGeneralDetails();
            this.tabs.forEach(ele => {
                ele.disabled = false;
            });
        }
    }

    getGeneralDetails() {
        this.loading = true;
        const slug = `${environment.customerms}/customers/?customer=${this.customerId}`;
        this.apiService.get(slug).subscribe((resp: ApiResponse) => {
            this.data = resp.data['data'][0];
            this.loading = false;
        }, (err: any) => {
            this.loading = false;
            this.toastrService.error(err.error['message'], 'Error getting general details', {
                progressAnimation: 'decreasing', progressBar: true, timeOut: 3000
            });
        });
    }

    onCustomerDetails(ev: any) {
        // console.log('gd event === ', ev);
        
        if (!!ev) {
            this.loading = !!ev.loading ? ev.loading : false;
            this.customerId = !!ev.id ? ev.id : this.customerId;
            this.activeId = ev.activeId ? ev.activeId : this.activeId;
            if (ev.action === 'reload') {
                this.getGeneralDetails();
            }
        }
        this.tabs[1].disabled = false;
    }

    onUploadDocument(ev: any) {
        // console.log('doc event === ', ev);
        if (!!ev) {
            this.loading = !!ev.loading ? ev.loading : false;
            // this.customerId = ev.id;
            this.activeId = ev.activeId ? ev.activeId : this.activeId;
            this.tabs[2].disabled = false;
        }
        // this.activeId = 'pkg';
    }

    onAssignPackage(ev: any) {
        // console.log('pkg event === ', ev);
        this.loading = !!ev.loading ? ev.loading : false;
        this.tabs[3].disabled = false;
        // this.activeId = 'al';
    }

    onAssignFeature(ev: any) {
        this.loading = !!ev.loading ? ev.loading : false;
        this.tabs[4].disabled = false;
    }

    onAdminListSignals(ev: any) {
        this.loading = !!ev.loading ? ev.loading : false;
        this.tabs[5].disabled = false;
        // this.activeId = 'hw';
    }

    onHardwareSignals(ev: any) {
        this.loading = !!ev.loading ? ev.loading : false;
        this.tabs[6].disabled = false;
    }

    onHardwareISignals(ev: any) {
        this.loading = !!ev.loading ? ev.loading : false;
    }
}
