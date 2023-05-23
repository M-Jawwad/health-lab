import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable()
export class AuthGuardService implements CanActivate {
    is_authenticated: boolean = false;

    constructor(public auth: AuthService, public router: Router) {
        // console.log("inside auth guard.ts file")
    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {

        // let is_authenticated: boolean;
        let url = state.url.split('/');
        const reqUrl = url[url.length - 1];

        let am: any = localStorage.getItem('menu');
        const activeMenu = JSON.parse(am);

        if (this.auth.isAuthenticated()) {
            activeMenu.forEach((element: any) => {
                if (element.is_parent) {
                    element.sub_menu.forEach((subMenu: any) => {
                        if (reqUrl === subMenu.route) {
                            this.is_authenticated = true;
                        }
                    });
                } else {
                    if (reqUrl === element.route) {
                        this.is_authenticated = true;
                    }
                }
            });
            // this.is_authenticated = true;
        }
        else {
            this.router.navigate(['']);
            this.is_authenticated = false;
        }
        return this.is_authenticated;
    }
}
