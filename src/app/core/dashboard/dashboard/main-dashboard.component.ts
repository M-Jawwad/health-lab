import { HttpClient, HttpErrorResponse, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'app-main-dashboard',
    templateUrl: './main-dashboard.component.html',
    styleUrls: ['./main-dashboard.component.scss']
})
export class MainDashboardComponent implements OnInit {
    toggleMenu: boolean;

    constructor() {
        this.toggleMenu = true;
    }

    ngOnInit(): void {
        
    }

    onToggleMenu(ev: any)
    {
        this.toggleMenu = ev;
    }

}
