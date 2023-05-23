import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from 'src/app/services/api.service';
import { PermissionService } from 'src/app/services/check-permissions.service';
import { environment } from 'src/environments/environment';


@Component({
    selector: 'app-settings',
    templateUrl: './settings.component.html',
    styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {
    loading: boolean;
    passwordForm: FormGroup;
    paginationSettingForm: FormGroup;
    loginSettingForm: FormGroup;
    readonly: boolean;

    constructor(
        private apiService: ApiService,
        private toastrService: ToastrService,
        private checkPermService: PermissionService
    ) {
        this.passwordForm = new FormGroup({
            minimum_password_length: new FormControl(null, [Validators.required, Validators.min(4), Validators.max(100)]),
            previous_password_check: new FormControl(null, [Validators.required, Validators.min(3), Validators.max(100)]),
            is_alphabetic: new FormControl(null, [Validators.required]),
            is_numeric: new FormControl(null, [Validators.required]),
            is_punctuation: new FormControl(null, [Validators.required]),
            is_upper: new FormControl(null, [Validators.required]),
            is_lower: new FormControl(null, [Validators.required]),
        });

        this.paginationSettingForm = new FormGroup({
            item_per_page: new FormControl(null, [Validators.required, Validators.max(1000), Validators.min(5)])
        });

        this.loginSettingForm = new FormGroup({
            session_time: new FormControl(null, [Validators.required, Validators.min(60), Validators.max(3600)])
        });

        this.loading = false;
        this.readonly = false;
    }

    ngOnInit(): void {
        let perm: any = this.checkPermService.checkPermissions();
        this.readonly = perm && perm.length > 0 && perm.includes('RW') ? false : true;

        this.getPasswordSettings();
        this.getPaginationSettings();
        this.getLoginSettings();
    }
    
    setValue() {
        let isAlphabetic = this.passwordForm.get('is_alphabetic')?.value;
        let isNumeric = this.passwordForm.get('is_numeric')?.value;
        let isPunc = this.passwordForm.get('is_punctuation')?.value;
        let isUpper = this.passwordForm.get('is_upper')?.value;
        let isLower = this.passwordForm.get('is_lower')?.value;

        this.passwordForm.get('is_alphabetic')?.setValue(isAlphabetic ? 'Yes' : 'No');
        this.passwordForm.get('is_numeric')?.setValue(isNumeric ? 'Yes' : 'No');
        this.passwordForm.get('is_punctuation')?.setValue(isPunc ? 'Yes' : 'No');
        this.passwordForm.get('is_upper')?.setValue(isUpper ? 'Yes' : 'No');
        this.passwordForm.get('is_lower')?.setValue(isLower ? 'Yes' : 'No');
    }

    getPasswordSettings() {
        const slug = `${environment.userms}/setting/?id=1`;

        this.apiService.get(slug).subscribe((resp: any) => {
            this.passwordForm.patchValue(resp.data['data']);
            this.setValue();
        }, (err: any) => {
            const status = err.error['status'];
            const statusCodes = [401, 2, 3, 11, 151, 153, 18, 300, 301];
            if (statusCodes.includes(status)) {
                this.toastrService.error(err.error['message'], 'Access Unauthorized', {
                    progressBar: true, progressAnimation: 'decreasing', timeOut: 3000
                });
            } else {
                this.toastrService.error(err.error['message'], 'Error getting password settings', {
                    progressAnimation: 'decreasing', progressBar: true, timeOut: 3000
                });
            }
        });
    }

    getPaginationSettings() {
        const slug = `${environment.userms}/setting/pagination-setting/?id=1`;

        this.apiService.get(slug).subscribe((resp: any) => {
            this.paginationSettingForm.patchValue(resp.data['data']);
        }, (err: any) => {
            const status = err.error['status'];
            const statusCodes = [401, 2, 3, 11, 151, 153, 18, 300, 301];
            if (statusCodes.includes(status)) {
                this.toastrService.error(err.error['message'], 'Access Unauthorized', {
                    progressBar: true, progressAnimation: 'decreasing', timeOut: 3000
                });
            } else {
                this.toastrService.error(err.error['message'], 'Error getting pagination settings', {
                    progressAnimation: 'decreasing', progressBar: true, timeOut: 3000
                });
            }
        });
    }

    getLoginSettings() {
        const slug = `${environment.userms}/setting/user-session-setting/?id=1`;

        this.apiService.get(slug).subscribe((resp: any) => {
            this.loginSettingForm.patchValue(resp.data['data']);
        }, (err: any) => {
            const status = err.error['status'];
            const statusCodes = [401, 2, 3, 11, 151, 153, 18, 300, 301];
            if (statusCodes.includes(status)) {
                this.toastrService.error(err.error['message'], 'Access Unauthorized', {
                    progressBar: true, progressAnimation: 'decreasing', timeOut: 3000
                });
            } else {
                this.toastrService.error(err.error['message'], 'Error getting login settings', {
                    progressAnimation: 'decreasing', progressBar: true, timeOut: 3000
                });
            }
        });
    }

    onSubmitPasswordSetting(formData: any) {
        this.loading = true;
        const slug = `${environment.userms}/setting/`;
        let payload = formData;
        payload.id = 1;

        this.apiService.patch(slug, payload).subscribe((resp: any) => {
            this.toastrService.success(resp.message, 'Success', {
                progressBar: true, progressAnimation: 'decreasing', timeOut: 3000
            });
            this.loading = false;
        }, (err: any) => {
            this.toastrService.error(err.error['message'], 'Error updating password settings', {
                progressBar: true, progressAnimation: 'decreasing', timeOut: 3000
            });
            this.loading = false;
        });
    }

    onSubmitPaginationSettings(formData: any) {
        this.loading = true;
        const slug = `${environment.userms}/setting/pagination-setting/`;
        let payload = formData;
        payload.id = 1;

        this.apiService.patch(slug, payload).subscribe((resp: any) => {
            this.loading = false;
            localStorage.setItem('limit', formData.item_per_page);
            this.toastrService.success(resp.message, 'Success', {
                progressBar: true, progressAnimation: 'decreasing', timeOut: 3000
            });
        }, (err: any) => {
            this.toastrService.error(err.error['message'], 'Error updating pagination settings', {
                progressBar: true, progressAnimation: 'decreasing', timeOut: 3000
            });
            this.loading = false;
        });
    }

    onSubmitLoginSessionSettings(formData: any) {
        this.loading = true;
        const slug = `${environment.userms}/setting/user-session-setting/`;
        let payload = formData;
        payload.id = 1;

        this.apiService.patch(slug, payload).subscribe((resp: any) => {
            this.toastrService.success(resp.message, 'Success', {
                progressBar: true, progressAnimation: 'decreasing', timeOut: 3000
            });
            this.loading = false;
        }, (err: any) => {
            this.toastrService.error(err.error['message'], 'Error updating login session settings', {
                progressBar: true, progressAnimation: 'decreasing', timeOut: 3000
            });
            this.loading = false;
        });
    }
}
