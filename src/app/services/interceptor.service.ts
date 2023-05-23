import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Router } from "@angular/router";
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { tap } from "rxjs/operators";
import { environment } from '../../environments/environment';


@Injectable()
export class InterceptorService implements HttpInterceptor {

	constructor(private router: Router) { }
	// private auth: AuthService,
	intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
		// Get the auth header from the service.
		let token = null;
		let authHeader = null;
		token = localStorage.getItem('token');

		const url = environment.baseUrl;
		const assetbaseUrl = environment.AssetbaseUrl;
		const assetbaseUrlAdvance = environment.AssetbaseUrlAdvance;
		const HTracking = environment.HTracking;
		const provisionerUrl = environment.provisionerUrl;
		const cobStagingUrl = environment.cobStagingUrl;
		const oldCob = environment.cobOld;
		const consumer = environment.consumer;
		const fms = environment.fms;

		if (!!token) {
			authHeader = token;
		}

		// Clone the request to add the new header.
		let cloneReq: any = null;
		if (authHeader != null) {
			let headers = req.headers;
			if (!req.url.includes(HTracking)) {
				headers = req.headers.set("Authorization", "Token " + authHeader);
			}

			if (req.url.includes(assetbaseUrlAdvance)
				|| req.url.includes(assetbaseUrl)
				|| req.url.includes(provisionerUrl) || req.url.includes(cobStagingUrl)
				|| req.url.includes(oldCob)
				|| req.url.includes(fms)
				|| req.url.includes(consumer)
			) {

				if (req.url.includes(assetbaseUrl)
					|| req.url.includes(assetbaseUrlAdvance)
					|| req.url.includes(cobStagingUrl)
					|| req.url.includes(oldCob)
					|| req.url.includes(fms)
					|| req.url.includes(consumer)
				) {
					headers = req.headers.set("user-auth", "Uz?/b~ASdRr(#h0V/azU").set("User-Platform", "WEB")
				}

				if (req.url.includes(provisionerUrl)) {
					headers = req.headers.set('Connection', 'keep-alive').set('Content-Length', '160')
						.set('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8').set('Host', 'provisioner.iot.vodafone.com.qa:9080')
				}

				let fmsUrl = req.url;
				if (fmsUrl.indexOf(environment.fms) !== -1) {
					fmsUrl = fmsUrl.replace(environment.fms, url);
					cloneReq = req.clone({ url: fmsUrl });
				} else {
					cloneReq = req.clone({ headers: headers, url: fmsUrl });
				}

			} else {
				let URL = this.getBaseUrl(req.url);
				cloneReq = req.clone({ headers: headers, url: URL });
			}
		} else {
			let URL = this.getBaseUrl(req.url);
			cloneReq = req.clone({ url: URL });
		}

		// Pass on the cloned request instead of the original request.
		return next.handle(cloneReq).pipe(
			tap((event => {
				if (event instanceof HttpResponse) {
				}
			}), err => {
				const error = err instanceof HttpErrorResponse;
				const status = err.error['status'];
				const statusCodes = [401, 2, 3, 11, 151, 153, 18, 300, 301];
				if (error && (statusCodes.includes(status))) {
					this.router.navigateByUrl('');
					localStorage.removeItem('token');
				}
			}));
	}

	getBaseUrl(url: any) {
		if (url.indexOf(environment.userms) !== -1) {
			url = url.replace(environment.userms, environment.userBaseUrl);
		} else if (url.indexOf(environment.pkgms) !== -1) {
			url = url.replace(environment.pkgms, environment.packagesBaseUrl);
		} else if (url.indexOf(environment.customerms) !== -1) {
			url = url.replace(environment.customerms, environment.customerBaseUrl);
		} else if (url.indexOf(environment.inventoryms) !== -1) {
			url = url.replace(environment.inventoryms, environment.inventoryBaseUrl);
		}

		return url;
	}
}
