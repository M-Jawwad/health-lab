import { HttpClient, HttpErrorResponse, HttpHeaders, HttpResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Observable } from "rxjs";
import { catchError, map } from "rxjs/operators";
import { ApiResponse } from "../interfaces/response";

@Injectable({
    providedIn: 'root'
})
export class ApiService {
    constructor(private http: HttpClient, private router: Router) { }

    public get(slug: string) {
        return this.http.get<ApiResponse>(slug);
    }

    public post(slug: string, postData: any) {
        return this.http.post<ApiResponse>(slug, postData);
    }

    public delete(slug: string) {
        return this.http.delete<ApiResponse>(slug);
    }

    public patch(slug: string, postData: any) {
        return this.http.patch<ApiResponse>(slug, postData);
    }

    public getExportXlsPdf(params: any): Observable<Blob> {
        const url = params;
        const myHeaders = new HttpHeaders();
        myHeaders.append('Access-Control-Allow-Origin', '*');
        return this.http.get(url, { responseType: 'blob', headers: myHeaders });
    }

    public getExportXlsx(params: any, payload: any): Observable<Blob> {
        const url = params;
        const myHeaders = new HttpHeaders();
        myHeaders.append('Access-Control-Allow-Origin', '*');
        return this.http.post(url, payload, { responseType: 'blob', headers: myHeaders });
    }

    public handleError(error: any) {
        if (error instanceof HttpErrorResponse) {
            const e: ApiResponse = {
                status: error.status,
                error: error.statusText,
                message: error.error['message']
            }

            error = e;
        }
    }
}