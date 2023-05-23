import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth.service';
import { environment } from 'src/environments/environment';

@Component({
    selector: 'app-forgot-password',
    templateUrl: './forgot-password.component.html',
    styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit {
    loading: boolean;
    otpBox: boolean;

    forgotPasswordForm: FormGroup;
    verifyOtpForm: FormGroup;
    requestType: string;
    resetToken: string;

    constructor(
        private toastr: ToastrService,
        private authService: AuthService,
        private router: Router,
        private route: ActivatedRoute,
        // private modalRef: NgbActiveModal,
    ) {
        this.otpBox = false;
        this.requestType = 'reset';
        this.resetToken = '';
        this.forgotPasswordForm = new FormGroup({
            email: new FormControl(null, [Validators.required, Validators.email, Validators.pattern("^[a-zA-Z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")])
        });

        this.verifyOtpForm = new FormGroup({
            otp: new FormControl(null, [Validators.required, Validators.minLength(6)])
        });

        this.loading = false;
    }

    ngOnInit(): void {
        let reqType: any = sessionStorage.getItem('reqType');
        if (reqType != null) {
            this.requestType = reqType;
        }
        this.route.queryParams.subscribe(params => {
            this.resetToken = params['reset-password-link'];
            console.log(this.resetToken, params);
        });
    }

    onSubmit() {
        this.loading = true;
    }

    onEmailSubmit() {
        this.loading = true;
        // this.otpBox = true;
        let email = this.forgotPasswordForm.value;

        const slug = `${environment.userms}/users/send-otp-to-email`;
        const payload = { email: email.email, reset_token: this.resetToken, request_type: this.requestType };

        this.authService.sendOTP(slug, payload).subscribe((resp: any) => {
            this.toastr.info('OTP sent to ' + payload.email, 'Info', {
                progressAnimation: 'decreasing', progressBar: true, timeOut: 3000
            });

            this.otpBox = true;
            this.loading = false;
        }, (err: any) => {
            this.loading = false;
            this.toastr.error(err.error['message'], 'Error', {
                progressBar: true, progressAnimation: 'decreasing', timeOut: 3000
            });
        });
    }

    onVerifyOTP() {
        this.loading = true;
        this.requestType = 'reset';
        // this.router.navigateByUrl('reset-password');
        let otp = this.verifyOtpForm.value;
        let email = this.forgotPasswordForm.value;

        const slug = `${environment.userms}/users/verify-email-otp`;
        const paylaod = { otp: otp.otp, email: email.email };

        this.authService.verifyOTP(slug, paylaod).subscribe((resp: any) => {
            this.loading = false;
            localStorage.setItem('email', paylaod.email);
            sessionStorage.setItem('reqType', this.requestType);
            this.router.navigateByUrl('reset-password');
            localStorage.setItem('reset-token', resp.data['reset_token']);
        }, (err: any) => {
            this.loading = false;
            this.toastr.error(err.error['message'], 'Error', {
                progressAnimation: 'decreasing', progressBar: true, timeOut: 3000
            });
        });
    }

    backToLogin() {
        this.router.navigateByUrl('');
    }

}
