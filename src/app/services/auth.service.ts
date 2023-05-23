import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from "@angular/router";
import { catchError, map } from "rxjs/operators";
import { BehaviorSubject, of } from 'rxjs';
// import { HttpService } from './http.service';
import { StorageService } from './local-storage.service';
import { environment } from 'src/environments/environment';
// import { isNullOrUndefined } from "util";

@Injectable({
    providedIn: 'root'
})
export class AuthService {

    constructor(private http: HttpClient, private router: Router, private storage: StorageService) {
        // console.log("inside auth service.ts file")
    }

    login(username: string, password: string) {
        const slug = `${environment.userms}/users/login`;
        const payload = { email: username, password: password };

        return this.http.post<any>(slug, payload).pipe(map(user => {
            if (user.status === 152) {
                localStorage.setItem('token', user.data['token']);
            }
            else {
                // console.log("inside else condition of login function in auth.service.ts")
                // console.error(user['message']);
            }
            return user;
        }));
    }

    getToken() {
        var token = null;
        var user = JSON.parse(localStorage.getItem('user') || '');

        if (user != null)
            token = user['token'];

        return token;
    }

    unsetUser() {
        this.storage.clear('user');
        // this.dataSource.next({});
        this.router.navigate(['/'])
    }

    setUser(user: any): void {
        if (!!user)
            this.storage.store('user', user);
    }

    // getUser() {
    //     return this.storage.getItem('user');
    // }

    isAuthenticated(): any {
        let token = localStorage.getItem('token');
        // console.log('token === ', token);
        if (token != void 0 && token != null) {
            return true;
        }
    }

    // updatedDataSelection(data: any) {
    //     this.dataSource.next(data);
    // }

    // returnUser() {
    //     return this.logged_in_user;
    // }

    sendOTP(url: string, payload: any) {
        return this.http.post(url, payload);
    }

    verifyOTP(slug: string, postData: any) {
        return this.http.post(slug, postData);
    }

}
