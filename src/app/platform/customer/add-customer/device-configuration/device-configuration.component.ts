import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { ApiResponse } from 'src/app/interfaces/response';
import { ApiService } from 'src/app/services/api.service';
import { environment } from 'src/environments/environment';


@Component({
    selector: 'app-device-configuration',
    templateUrl: './device-configuration.component.html',
    styleUrls: ['./device-configuration.component.scss'],
})
export class DeviceConfigurationComponent implements OnInit {
    title: string;

    readonly: boolean;
    loading: boolean;

    data: any;
    device_frequency: FormControl;

    constructor(
        private modalRef: NgbActiveModal,
        private apiService: ApiService,
        private toastrService: ToastrService,
    ) {
        this.title = 'Edit Frequency';
        this.loading = false;
        this.readonly = false;

        this.data = null;

        this.device_frequency = new FormControl(null, [Validators.required]);
    }

    ngOnInit(): void {
        if (!!this.data) {
            this.device_frequency.setValue(this.data.frequency);
        }
    }

    onSubmit() {
        this.loading = true;
        let data = this.data;
        const slug = `${environment.customerms}/customers/customer-hardware-frequency`;
        let payload = {
            device_type: data.device_type,
            customer_allocation_id: data.customer_allocation,
            inventory_id: data.inventory,
            customer: data.customer,
            frequency: this.device_frequency.value
        };

        this.apiService.patch(slug, payload).subscribe((resp: ApiResponse) => {
            this.loading = false;
            this.changeFrequency(payload);
            // this.toastrService.success(resp.message, 'Device frequency successfully updated', {
            //     progressBar: true, progressAnimation: 'decreasing', timeOut: 3000
            // });
            // this.modalRef.close();
        }, (err: any) => {
            this.loading = false;
            this.toastrService.error(err.error['message'], 'Error updating frequency of device', {
                progressBar: true, progressAnimation: 'decreasing', timeOut: 3000
            });
        });
    }

    changeFrequency(ev: any) {
        this.loading = true;
        const slug = `${environment.AssetbaseUrl}/am/sendActionToDevice/?imei=${this.data.device_id}&action=updateFrequency&frequency=${ev.frequency}`;
        this.apiService.get(slug).subscribe((resp: any) => {
            this.loading = false;
            this.modalRef.close();
        }, (err: any) => {
            this.loading = false;
            this.toastrService.error('Error updating device frequency', err.error['message'], {
                progressBar: true, progressAnimation: 'decreasing', timeOut: 3000
            });
        })
    }

    onCloseModal() {
        this.modalRef.close();
    }

}
