import { Injectable } from "@angular/core";
import { Router } from "@angular/router";


@Injectable({
    providedIn: 'root'
})
export class PermissionService {
    
    permission: string[];

    constructor(private router: Router) {
        this.permission = [];
    }

    public checkPermissions(): string[] {
        let url = this.router.url.split('/');
        
        let activeMenu: any = localStorage.getItem('menu');
        let acMenu = JSON.parse(activeMenu);
        
        if (acMenu?.length)
        {
            acMenu.forEach((element: any) => {
                if (element.is_parent && element.sub_menu.length > 0) {
                    element.sub_menu.forEach((ele: any) => {
                        let r = ele.route.split('/');
                        if (r[r.length - 1] === url[url.length - 1]) {
                            this.permission = ele.permissions;
                        }
                    });
                } else {
                    if (element.route === url[2]) {
                        this.permission = element.permissions;
                        // console.log(element.permissions);
                    }
                }
            });
        }
        return this.permission;
    }
}