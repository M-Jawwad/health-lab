import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { Idle, DEFAULT_INTERRUPTSOURCES } from '@ng-idle/core';
import { Keepalive } from '@ng-idle/keepalive';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from 'src/app/services/api.service';
import { environment } from 'src/environments/environment';
import { Subscription } from 'rxjs';
@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
    toggleMenu: boolean;
    acUser: any;
    @Output() signal: EventEmitter<any>;

    idleState = "Not Started";
    lastPing?: Date;
    timedOut: boolean;
    sessionTimeOut: number;
    userSubscription$ = new Subscription;

    constructor(
        private apiService: ApiService,
        private toastrService: ToastrService,
        private router: Router,
        private idle: Idle, private keepalive: Keepalive
    ) {
        this.toggleMenu = true;
        this.signal = new EventEmitter<any>();
        this.acUser = null;
        this.timedOut = false;
        this.sessionTimeOut = 60;
    }

    ngOnInit(): void {
        this.signal.emit(this.toggleMenu);
        this.getCurrentUser();

        this.getLoginSettings();
        // this.getPaginationSettings();
        // this.monitorUserIdling();

        // watch for changes in localStorage, change header properties accordingly for user
        this.userSubscription$ = localStorage?.changes?.subscribe((res: any) => {
            var loggedInUser: any = localStorage.getItem('user');
            loggedInUser = JSON.parse(loggedInUser)
            if (loggedInUser) {
                this.acUser = loggedInUser
            }

        });
    }

    getLoginSettings() {
        const slug = `${environment.userms}/setting/user-session-setting/?id=1`;

        this.apiService.get(slug).subscribe((resp: any) => {
            let data = resp.data['data'];
            this.sessionTimeOut = +data.session_time;
            this.monitorUserIdling();
        }, (err: any) => {
            this.toastrService.error(err.error['message'], 'Error getting login settings', {
                progressAnimation: 'decreasing', progressBar: true, timeOut: 3000
            });
        });
    }

    getCurrentUser() {
        const slug = `${environment.userms}/users/get-current-user`;
        this.apiService.get(slug).subscribe((resp: any) => {
            this.acUser = resp.data['data'];
            localStorage.setItem('user', JSON.stringify(this.acUser));
        }, (err: any) => {
            const status = err.error['status'];
            const statusCodes = [401, 2, 3, 11, 151, 153, 18, 300, 301];
            if (statusCodes.includes(status)) {
                this.toastrService.error(err.error['message'], 'Access Unauthorized', {
                    progressBar: true, progressAnimation: 'decreasing', timeOut: 3000
                });
            } else {
                this.toastrService.error(err.error['message'], 'Error getting user information', {
                    progressAnimation: 'decreasing', progressBar: true, timeOut: 3000
                });
            }
        });
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

    onToggleMenu() {
        this.toggleMenu = !this.toggleMenu;
        this.signal.emit(this.toggleMenu);
    }

    onLogout() {
        const slug = `${environment.userms}/users/logout`;

        this.apiService.post(slug, {}).subscribe((resp: any) => {
            window.location.href = '';
            localStorage.removeItem('token');
            localStorage.removeItem('menu');
            localStorage.removeItem('user');
            localStorage.removeItem('limit');
        }, (err: any) => {
            this.toastrService.error(err.error['message'], 'Error', {
                progressAnimation: 'decreasing', progressBar: true, timeOut: 3000
            });
        });
    }

    navigateToProfile() {
        this.router.navigateByUrl('admin/users/user-profile')
    }

    monitorUserIdling() {
        // sets an idle timeout of 600 seconds, for testing purposes.
        this.idle.setIdle(this.sessionTimeOut);
        // sets a timeout period of 600 seconds. after 10 seconds of inactivity, the user will be considered timed out.
        this.idle.setTimeout(5);
        // sets the default interrupts, in this case, things like clicks, scrolls, touches to the document
        this.idle.setInterrupts(DEFAULT_INTERRUPTSOURCES);

        this.idle.onIdleStart.subscribe(() => {
            this.idleState = 'You\'ve gone idle!'
        });

        this.idle.onIdleEnd.subscribe(() => {
            this.idleState = 'No longer idle.'
            this.reset();
        });

        this.idle.onTimeoutWarning.subscribe((countdown) => {
            this.idleState = 'You will time out in ' + countdown + ' seconds!';
            // console.log("this.idleState= = = ", this.idleState)
        });

        this.idle.onTimeout.subscribe(() => {
            this.idleState = 'Timed out!';
            this.timedOut = true;
            this.onLogout();
        });

        // sets the ping interval to 15 seconds
        this.keepalive.interval(5);
        this.keepalive.onPing.subscribe(() => {
            this.lastPing = new Date();
        });

        this.reset();
    }

    reset() {
        // we'll call this method when we want to start/reset the idle process
        // reset any component state and be sure to call idle.watch()
        this.idle.watch();
        this.idleState = "Started.";
        this.timedOut = false;
        // this.countdown = null;
        this.lastPing = void 0;
    }

}
