import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { ToastrService } from 'ngx-toastr';
import { ApiResponse } from 'src/app/interfaces/response';
import { ApiService } from 'src/app/services/api.service';


@Component({
    selector: 'app-device-history',
    templateUrl: './device-history.component.html',
    styleUrls: ['./device-history.component.scss']
})
export class DeviceHistoryComponent implements OnInit {
    loading: boolean;
    readonly: boolean;

    title: string;

    deviceHistory: any[] = [];

    data: any;

    constructor(
        private apiService: ApiService,
        private modalRef: NgbActiveModal,
        private toastrService: ToastrService,
        private router: Router,
    ) {
        this.loading = false;
        this.readonly = false;

        this.title = 'Device History';

        this.data = null;

        // Array with static data (remove this in future)
        this.deviceHistory = [
            { customer: 'Vodafone', device_status: 'Active', allocation_date: 1232323242, deallocation_date: 1232399242 },
        ]

        // Array with dynamic data (use this in future)
        // this.deviceHistory = [
        //     { customer_name: 'Vodafone', status: 'Active', allocation_date: 1232323242, deallocation_date: 1232399242 },
        // ]
    }

    ngOnInit(): void {
        if (!!this.data) {
            console.log(this.data);
            // this.deviceHistory = this.data (use this in future)
        }
    }

    goToCustomer() {
        this.modalRef.close();
        this.router.navigateByUrl('admin/customer/details');
    }

    onCloseModal() {
        this.modalRef.close();
    }
}
