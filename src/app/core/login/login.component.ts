import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from 'src/app/services/api.service';
import { AuthService } from 'src/app/services/auth.service';
import { environment } from 'src/environments/environment';
import { Menu } from '../model';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
    model: any = { username: '', password: '', remember_me: false };
    loading: boolean;
    hidePassword: boolean;

    loginError: boolean;
    errorMessage: any;
    menus: Menu[];

    constructor(
        private toastr: ToastrService,
        private authService: AuthService,
        private apiService: ApiService,
        private toastrService: ToastrService,
        private router: Router,
    ) {
        this.hidePassword = true;
        this.loading = false;
        this.loginError = false;
        this.errorMessage = null;
        this.menus = [];
    }

    ngOnInit(): void {
        const username = localStorage.getItem('username');
        const password = localStorage.getItem('password');
        if (!!username || !!password) {
            this.model.username = username;
            this.model.password = password;
            this.model.remember_me = true;
        }
    }

    onSubmit() {
        this.loading = true;
        if (this.model.remember_me) {
            localStorage.setItem('username', this.model.username)
            localStorage.setItem('password', this.model.password)
        }

        const payload = this.model;
        // this.router.navigateByUrl('admin');
        this.authService.login(payload.username, payload.password).subscribe((resp: any) => {
            this.getPaginationSettings();
            if (resp.data['is_change_password']) {
                this.router.navigateByUrl('reset-password');
                localStorage.setItem('email', this.model.username);
                localStorage.setItem('reset-token', resp.data['reset_token']);
                this.loading = false;
            }
            else {
                this.getMenu();
            }
        }, (err: any) => {
            console.error(err);
            this.toastr.error(err.error['message'], 'Error', {
                progressBar: true,
                progressAnimation: 'decreasing',
                timeOut: 3000
            });
            this.errorMessage = err.message;
            this.loading = false;
        });
    }

    onForgotPassword() {
        sessionStorage.setItem('reqType', 'forgot');
        this.router.navigateByUrl('forgot-password');
    }

    getMenu() {
        // localStorage.removeItem('menu');
        const slug = `${environment.userms}/users/menu-preferences`;

        return this.apiService.get(slug).subscribe((resp: any) => {
            this.loading = false;
            this.menus = resp.data;
            localStorage.setItem('menu', JSON.stringify(this.menus));

            if (!this.menus[0].is_parent) {
                setTimeout(() => {
                    this.router.navigateByUrl(`admin/${this.menus[0].route}`);
                }, 2000)
            } else if (this.menus[0].is_parent && this.menus[0].sub_menu) {
                for (let i = 0; i < this.menus[0].sub_menu.length; i++) {
                    const element = this.menus[0].sub_menu[0].route;
                    setTimeout(() => {
                        this.router.navigateByUrl(`admin/${element}`);
                        return;
                    }, 2000)
                }
            }
        }, (err: any) => {
            this.loading = false;
            this.toastr.error(err.error['message'], 'Error',
                { progressAnimation: 'decreasing', progressBar: true, timeOut: 3000 });
        });
    }

    getSortedArray(data: any[]) {
        let st = data.sort((a, b) => (a.name > b.name ? 1 : -1));
        return st;
    }

    getPaginationSettings() {
        const slug = `${environment.userms}/setting/pagination-setting/?id=1`;

        this.apiService.get(slug).subscribe((resp: any) => {
            let limit = resp.data['data']['item_per_page'];
            localStorage.setItem('limit', limit);
        }, (err: any) => {
            this.toastrService.error(err.error['message'], 'Error getting pagination settings', {
                progressAnimation: 'decreasing', progressBar: true, timeOut: 3000
            });
        });
    }
}
