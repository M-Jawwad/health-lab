import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { ToastrService } from 'ngx-toastr';
import { ApiResponse } from 'src/app/interfaces/response';
import { ApiService } from 'src/app/services/api.service';
import * as dateFns from 'date-fns';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { CustomValidators } from 'src/app/utils/custom-validators';

@Component({
    selector: 'app-hardware-installation',
    templateUrl: './hardware-installation.component.html',
    styleUrls: ['./hardware-installation.component.scss']
})
export class HardwareInstallationComponent implements OnInit {
    loading: boolean;
    @Input() readonly: boolean;
    @Input() customerId: number;
    @Output() signals: EventEmitter<any>;

    hiForm: FormGroup;

    data: any = null;

    constructor(
        private fb: FormBuilder,
        private apiService: ApiService,
        private toastrService: ToastrService,
    ) {
        this.loading = false;
        this.readonly = false;
        this.customerId = 0;

        this.hiForm = this.fb.group({
            is_required: false,
            status: ['not_initiated', [Validators.required]],
            start_date: [null, [Validators.required]],
            end_date: [null, [Validators.required]],
            address: [null, [Validators.required, Validators.maxLength(600), CustomValidators.noWhiteSpace]],
        });

        this.signals = new EventEmitter();
    }

    ngOnInit(): void {
        this.getHInstallationInfo();
        this.hiForm.get('is_required')?.valueChanges.pipe(debounceTime(400), distinctUntilChanged()).subscribe(value => {
            console.log(value);
            if (value) {
                this.hiForm.get('address')?.setValidators([Validators.required]);
            } else {
                this.hiForm.get('address')?.removeValidators([Validators.required]);
            }
        })
    }

    getHInstallationInfo() {
        this.signals.emit({ loading: true });
        const slug = `${environment.customerms}/customers/customer-hardware-installation?customer_id=${this.customerId}`;
        this.apiService.get(slug).subscribe((resp: ApiResponse) => {
            this.data = resp.data;
            if (this.data) {
                this.data.start_date = this.makeDateObject(this.data.start_date);
                this.data.end_date = this.makeDateObject(this.data.end_date);
                this.hiForm.patchValue(this.data);
            }
            this.signals.emit({ loading: false });
        }, (err: any) => {
            this.signals.emit({ loading: false });
            this.toastrService.error(err.error['message'], 'Error getting hardware installation info', {
                progressBar: true, progressAnimation: 'decreasing', timeOut: 3000
            });
        });
    }

    onSubmit() {
        this.signals.emit({ loading: false });
        let slug = `${environment.customerms}/customers/customer-hardware-installation`;
        let payload = this.hiForm.value;

        payload.start_date = this.makeDate(payload.start_date);
        payload.end_date = this.makeDate(payload.end_date);
        payload.customer = this.customerId;

        if (this.data && this.data.id) {
            slug = `${environment.customerms}/customers/customer-hardware-installation?id=${this.data.id}`;
            this.updateAdmin(slug, payload);
        } else {
            this.createAdmin(slug, payload);
        }
    }

    createAdmin(slug: string, paylaod: any) {
        this.apiService.post(slug, paylaod).subscribe((resp: ApiResponse) => {
            this.signals.emit({ loading: false });
            this.toastrService.success(resp.message, 'Hardware installation info created', {
                progressAnimation: 'decreasing', progressBar: true, timeOut: 3000
            });
            this.getHInstallationInfo();
        }, (err: any) => {
            this.signals.emit({ loading: false });
            this.toastrService.error(err.error['message'], 'Error creating hardware installation info', {
                progressAnimation: 'decreasing', progressBar: true, timeOut: 3000
            });
        });
    }

    updateAdmin(slug: string, paylaod: any) {
        this.apiService.patch(slug, paylaod).subscribe((resp: ApiResponse) => {
            this.toastrService.success(resp.message, 'Hardware installation information updated successfuly', {
                progressAnimation: 'decreasing', progressBar: true, timeOut: 3000
            });
            this.signals.emit({ loading: false });
            this.getHInstallationInfo();
        }, (err: any) => {
            this.toastrService.error(err.error['message'], 'Error updating hardware installation info', {
                progressAnimation: 'decreasing', progressBar: true, timeOut: 3000
            });
            this.signals.emit({ loading: false });
        });
    }

    makeDate(ev: any) {
        if (!!ev) {
            let date = new Date(`${ev.year}-${ev.month}-${ev.day}`);
            return ev = dateFns.format(date, 'yyyy-MM-dd');
        } else {
            return;
        }
    }

    makeDateObject(ev: any) {
        if (!!ev) {
            let arr = ev.split('-');
            return ev = { year: +arr[0], month: +arr[1], day: +arr[2] };
        } else {
            return;
        }
    }
}
