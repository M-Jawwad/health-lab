import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { ApiService } from 'src/app/services/api.service';
import { environment } from 'src/environments/environment';

@Component({
    selector: 'app-change-password',
    templateUrl: './change-password.component.html',
    styleUrls: ['./change-password.component.scss'],
    // providers: [NgbActiveModal]
})
export class ChangePasswordComponent implements OnInit {
    loading: boolean;
    hidePassword: boolean;
    hideNewPassword: boolean;
    hideConfirmPassword: boolean;
    fromProfile: boolean;

    resetPasswordForm: FormGroup;
    requestType: string;
    email: any;
    // modalRef: any = null;

    constructor(
        private toastr: ToastrService,
        private apiService: ApiService,
        private router: Router,
        private modalRef: NgbModal,
    ) {
        this.loading = false;
        this.hidePassword = true;
        this.hideNewPassword = true;
        this.hideConfirmPassword = true;
        this.fromProfile = false;
        this.requestType = 'profile';
        this.email = '';

        this.resetPasswordForm = new FormGroup({
            new_password: new FormControl(null, [Validators.required]),
            confirm_new_password: new FormControl(null, [Validators.required]),
        });
    }

    ngOnInit(): void {
        let reqType: any = sessionStorage.getItem('reqType');
        if (reqType !== null) {
            this.requestType = this.fromProfile ? 'profile' : reqType;
        }
        sessionStorage.removeItem('reqType');

        if (this.requestType !== 'reset') {
            this.resetPasswordForm.addControl('old_password', new FormControl(null, [Validators.required]));
        }

        // setTimeout(() => {
        //     this.resetPasswordForm.get('confirm_new_password')?.setValidators(this.checkPassword);
        // }, 500);

        this.resetPasswordForm.get('confirm_new_password')?.valueChanges.pipe(debounceTime(400), distinctUntilChanged()).subscribe(value => {
            this.checkPassword();
        })
    }

    skipNow() {
        this.router.navigateByUrl('admin');
    }

    onSubmit() {
        this.loading = true;
        const slug = `${environment.userms}/users/change-password`;
        const formData = this.resetPasswordForm.value;
        let email: any = null;
        let resetToken: any = null;
        if (this.fromProfile) {
            const u: any = localStorage.getItem('user');
            const user = JSON.parse(u);
            email = user.email;
            resetToken = user.reset_token;

        } else {
            email = localStorage.getItem('email');
            resetToken = localStorage.getItem('reset-token');
        }
        if (email != null) { this.email = email };
        
        let payload: any = { email: this.email, new_password: formData.confirm_new_password, request_type: this.requestType, reset_token: resetToken };
        if (this.requestType === 'profile') {
            payload['old_password'] = formData.old_password;
        }
        
        this.apiService.patch(slug, payload).subscribe((resp: any) =>
        {
            this.loading = false;
            localStorage.removeItem('email');
            this.toastr.success(resp.data['message'], 'Success', {
                progressBar: true, progressAnimation: 'decreasing', timeOut: 3000
            });
            if (this.requestType === 'reset' || this.requestType === 'profile') {
                if (this.modalRef && this.modalRef.hasOpenModals()) {
                    this.modalRef.dismissAll();
                } else {
                    this.router.navigateByUrl('');
                }
            } else {
                this.router.navigateByUrl('admin');
            }
        }, (err: any) =>
        {
            this.loading = false;
            this.toastr.error(err.error['message'], 'Error', {
                progressBar: true, progressAnimation: 'decreasing', timeOut: 3000
            });
        });
    }

    checkPassword(): any {
        const newPassword = this.resetPasswordForm.get('new_password')?.value;
        const conNewPassword = this.resetPasswordForm.get('confirm_new_password')?.value;
        if (newPassword !== conNewPassword) {
            this.resetPasswordForm.markAsDirty();
            this.resetPasswordForm.get('confirm_new_password')?.setErrors({ 'nomatch': true });
        }
    }

    onCloseModal() {
        this.modalRef.dismissAll();
    }
}
