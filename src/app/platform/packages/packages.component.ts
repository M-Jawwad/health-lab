import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { ApiResponse } from 'src/app/interfaces/response';
import { ApiService } from 'src/app/services/api.service';
import { PermissionService } from 'src/app/services/check-permissions.service';
import { VAlertAction } from 'src/app/shared/alert/alert.model';
import { AlertService } from 'src/app/shared/alert/alert.service';
import { environment } from 'src/environments/environment';
import { FeatureFormComponent } from './feature-form/feature-form.component';


@Component({
    selector: 'app-packages',
    templateUrl: './packages.component.html',
    styleUrls: ['./packages.component.scss']
})
export class PackagesComponent implements OnInit {

    loading: boolean;
    readonly: boolean;
    active: number;
    data: any;
    fmsData: any;
    atData: any;
    usecases: any[];
    newData: any[];
    lastUId: number;

    // added by wahab
    responseOFATAPI: any;
    responseOFATDashboardAPI: any;
    responseOFATAlertAPI: any;
    responseOFATConfigAPI: any;
    responseOFATReportsAPI: any;
    responseOFATAnaysticsAPI: any;
    responseOFATAssetAPI: any;
    responseOFATAppsAPI: any;
    responseOFAAllocateAPI: any;
    packagefeaturelist: any[];

    constructor(
        private apiService: ApiService,
        private toastrService: ToastrService,
        private checkPermService: PermissionService,
        private modal: NgbModal
    ) {
        this.loading = false;
        this.readonly = false;
        this.usecases = []
        // this.usecases = [
        //     { usecase_name: 'Fleet Management System', usecase_id: 7, id: 7 },
        //     { usecase_name: 'Asset Tracking', usecase_id: 2, id: 6 }
        // ];
        this.data = null;
        this.packagefeaturelist = []
        this.fmsData = {
            modules: [
                {
                    module_id: 1, module_name: 'FMS Dashboard', id: 1,
                    packages: [
                        {
                            id: 7,
                            module_name: "Advance Plus",
                            currency_name: "US $",
                            month_price: 0,
                            quarter_price: 0,
                            annual_price: 0,
                            name: "Advance Plus",
                            module_id: 1,
                            description: "Advance Package",
                            modified_datetime: "2021-03-09T14:35:50.315098Z"
                        },
                        {
                            id: 6,
                            module_name: "Advance",
                            currency_name: "US $",
                            month_price: 0,
                            quarter_price: 0,
                            annual_price: 0,
                            name: "Advance",
                            module_id: 1,
                            description: "Standard Package",
                            modified_datetime: "2021-03-09T14:35:50.315098Z"
                        },
                        {
                            id: 5,
                            module_name: "Plug & Go",
                            currency_name: "US $",
                            month_price: 0,
                            quarter_price: 0,
                            annual_price: 0,
                            name: "Plug & Go",
                            module_id: 1,
                            description: "Plug and Go Package",
                            modified_datetime: "2021-02-26T14:28:22.422814Z"
                        }
                    ],
                    features: [
                        {
                            id: 90,
                            name: "Admin App",
                            usecase_id: 1,
                            packages: [
                                {
                                    id: 7,
                                    name: "Advance Plus",
                                    is_selected: true
                                },
                                {
                                    id: 6,
                                    name: "Advance",
                                    is_selected: true
                                },
                                {
                                    id: 5,
                                    name: "Plug & Go",
                                    is_selected: true
                                }
                            ]
                        },
                        {
                            id: 89,
                            name: "Driver App",
                            usecase_id: 1,
                            packages: [
                                {
                                    id: 7,
                                    name: "Advance Plus",
                                    is_selected: true
                                },
                                {
                                    id: 6,
                                    name: "Advance",
                                    is_selected: true
                                },
                                {
                                    id: 5,
                                    name: "Plug & Go",
                                    is_selected: false
                                }
                            ]
                        },
                        {
                            id: 88,
                            name: "Alert Subscription ",
                            usecase_id: 1,
                            packages: [
                                {
                                    id: 7,
                                    name: "Advance Plus",
                                    is_selected: true
                                },
                                {
                                    id: 6,
                                    name: "Advance",
                                    is_selected: true
                                },
                                {
                                    id: 5,
                                    name: "Plug & Go",
                                    is_selected: true
                                }
                            ]
                        },
                        {
                            id: 87,
                            name: "Panic button alert",
                            usecase_id: 1,
                            packages: [
                                {
                                    id: 7,
                                    name: "Advance Plus",
                                    is_selected: true
                                },
                                {
                                    id: 6,
                                    name: "Advance",
                                    is_selected: true
                                },
                                {
                                    id: 5,
                                    name: "Plug & Go",
                                    is_selected: false
                                }
                            ]
                        },
                        {
                            id: 86,
                            name: "Event based alerts",
                            usecase_id: 1,
                            packages: [
                                {
                                    id: 7,
                                    name: "Advance Plus",
                                    is_selected: true
                                },
                                {
                                    id: 6,
                                    name: "Advance",
                                    is_selected: true
                                },
                                {
                                    id: 5,
                                    name: "Plug & Go",
                                    is_selected: true
                                }
                            ]
                        },
                        {
                            id: 85,
                            name: "Battery Alerts",
                            usecase_id: 1,
                            packages: [
                                {
                                    id: 7,
                                    name: "Advance Plus",
                                    is_selected: true
                                },
                                {
                                    id: 6,
                                    name: "Advance",
                                    is_selected: true
                                },
                                {
                                    id: 5,
                                    name: "Plug & Go",
                                    is_selected: true
                                }
                            ]
                        },
                        {
                            id: 84,
                            name: "Tamper/ Theft Alerts",
                            usecase_id: 1,
                            packages: [
                                {
                                    id: 7,
                                    name: "Advance Plus",
                                    is_selected: true
                                },
                                {
                                    id: 6,
                                    name: "Advance",
                                    is_selected: true
                                },
                                {
                                    id: 5,
                                    name: "Plug & Go",
                                    is_selected: true
                                }
                            ]
                        },
                        {
                            id: 83,
                            name: "View all alerts",
                            usecase_id: 1,
                            packages: [
                                {
                                    id: 7,
                                    name: "Advance Plus",
                                    is_selected: true
                                },
                                {
                                    id: 6,
                                    name: "Advance",
                                    is_selected: true
                                },
                                {
                                    id: 5,
                                    name: "Plug & Go",
                                    is_selected: true
                                }
                            ]
                        },
                        {
                            id: 82,
                            name: "Automatic fuel data & alerts (Automatic)",
                            usecase_id: 1,
                            packages: [
                                {
                                    id: 7,
                                    name: "Advance Plus",
                                    is_selected: true
                                },
                                {
                                    id: 6,
                                    name: "Advance",
                                    is_selected: false
                                },
                                {
                                    id: 5,
                                    name: "Plug & Go",
                                    is_selected: false
                                }
                            ]
                        },
                        {
                            id: 81,
                            name: "Predictive Maintenance Alert",
                            usecase_id: 1,
                            packages: [
                                {
                                    id: 7,
                                    name: "Advance Plus",
                                    is_selected: true
                                },
                                {
                                    id: 6,
                                    name: "Advance",
                                    is_selected: true
                                },
                                {
                                    id: 5,
                                    name: "Plug & Go",
                                    is_selected: false
                                }
                            ]
                        },
                        {
                            id: 80,
                            name: "SMS alerts",
                            usecase_id: 1,
                            packages: [
                                {
                                    id: 7,
                                    name: "Advance Plus",
                                    is_selected: true
                                },
                                {
                                    id: 6,
                                    name: "Advance",
                                    is_selected: true
                                },
                                {
                                    id: 5,
                                    name: "Plug & Go",
                                    is_selected: true
                                }
                            ]
                        },
                        {
                            id: 79,
                            name: "Email Alerts",
                            usecase_id: 1,
                            packages: [
                                {
                                    id: 7,
                                    name: "Advance Plus",
                                    is_selected: true
                                },
                                {
                                    id: 6,
                                    name: "Advance",
                                    is_selected: true
                                },
                                {
                                    id: 5,
                                    name: "Plug & Go",
                                    is_selected: true
                                }
                            ]
                        },
                        {
                            id: 78,
                            name: "Excessive idling alert",
                            usecase_id: 1,
                            packages: [
                                {
                                    id: 7,
                                    name: "Advance Plus",
                                    is_selected: true
                                },
                                {
                                    id: 6,
                                    name: "Advance",
                                    is_selected: true
                                },
                                {
                                    id: 5,
                                    name: "Plug & Go",
                                    is_selected: true
                                }
                            ]
                        },
                        {
                            id: 77,
                            name: "Fuel level alerts",
                            usecase_id: 1,
                            packages: [
                                {
                                    id: 7,
                                    name: "Advance Plus",
                                    is_selected: true
                                },
                                {
                                    id: 6,
                                    name: "Advance",
                                    is_selected: false
                                },
                                {
                                    id: 5,
                                    name: "Plug & Go",
                                    is_selected: false
                                }
                            ]
                        },
                        {
                            id: 76,
                            name: "Harsh accelerations / deccelerations and braking alerts",
                            usecase_id: 1,
                            packages: [
                                {
                                    id: 7,
                                    name: "Advance Plus",
                                    is_selected: true
                                },
                                {
                                    id: 6,
                                    name: "Advance",
                                    is_selected: true
                                },
                                {
                                    id: 5,
                                    name: "Plug & Go",
                                    is_selected: true
                                }
                            ]
                        },
                        {
                            id: 75,
                            name: "Geo fence entry / exit alerts",
                            usecase_id: 1,
                            packages: [
                                {
                                    id: 7,
                                    name: "Advance Plus",
                                    is_selected: true
                                },
                                {
                                    id: 6,
                                    name: "Advance",
                                    is_selected: true
                                },
                                {
                                    id: 5,
                                    name: "Plug & Go",
                                    is_selected: true
                                }
                            ]
                        },
                        {
                            id: 74,
                            name: "Geo fence violation alerts",
                            usecase_id: 1,
                            packages: [
                                {
                                    id: 7,
                                    name: "Advance Plus",
                                    is_selected: true
                                },
                                {
                                    id: 6,
                                    name: "Advance",
                                    is_selected: true
                                },
                                {
                                    id: 5,
                                    name: "Plug & Go",
                                    is_selected: true
                                }
                            ]
                        },
                        {
                            id: 73,
                            name: "Over speeding alerts",
                            usecase_id: 1,
                            packages: [
                                {
                                    id: 7,
                                    name: "Advance Plus",
                                    is_selected: true
                                },
                                {
                                    id: 6,
                                    name: "Advance",
                                    is_selected: true
                                },
                                {
                                    id: 5,
                                    name: "Plug & Go",
                                    is_selected: true
                                }
                            ]
                        },
                        {
                            id: 72,
                            name: "Predictive Maintenance",
                            usecase_id: 1,
                            packages: [
                                {
                                    id: 7,
                                    name: "Advance Plus",
                                    is_selected: true
                                },
                                {
                                    id: 6,
                                    name: "Advance",
                                    is_selected: true
                                },
                                {
                                    id: 5,
                                    name: "Plug & Go",
                                    is_selected: false
                                }
                            ]
                        },
                        {
                            id: 71,
                            name: "Maintenance Job Summary",
                            usecase_id: 1,
                            packages: [
                                {
                                    id: 7,
                                    name: "Advance Plus",
                                    is_selected: true
                                },
                                {
                                    id: 6,
                                    name: "Advance",
                                    is_selected: true
                                },
                                {
                                    id: 5,
                                    name: "Plug & Go",
                                    is_selected: false
                                }
                            ]
                        },
                        {
                            id: 70,
                            name: "Maintenance Workorder creation",
                            usecase_id: 1,
                            packages: [
                                {
                                    id: 7,
                                    name: "Advance Plus",
                                    is_selected: true
                                },
                                {
                                    id: 6,
                                    name: "Advance",
                                    is_selected: true
                                },
                                {
                                    id: 5,
                                    name: "Plug & Go",
                                    is_selected: false
                                }
                            ]
                        },
                        {
                            id: 68,
                            name: "Fuel Consumption Reports",
                            usecase_id: 1,
                            packages: [
                                {
                                    id: 7,
                                    name: "Advance Plus",
                                    is_selected: true
                                },
                                {
                                    id: 6,
                                    name: "Advance",
                                    is_selected: true
                                },
                                {
                                    id: 5,
                                    name: "Plug & Go",
                                    is_selected: true
                                }
                            ]
                        },
                        {
                            id: 67,
                            name: "Driver punctuality report ",
                            usecase_id: 1,
                            packages: [
                                {
                                    id: 7,
                                    name: "Advance Plus",
                                    is_selected: true
                                },
                                {
                                    id: 6,
                                    name: "Advance",
                                    is_selected: true
                                },
                                {
                                    id: 5,
                                    name: "Plug & Go",
                                    is_selected: false
                                }
                            ]
                        },
                        {
                            id: 66,
                            name: "Jobs reports",
                            usecase_id: 1,
                            packages: [
                                {
                                    id: 7,
                                    name: "Advance Plus",
                                    is_selected: true
                                },
                                {
                                    id: 6,
                                    name: "Advance",
                                    is_selected: true
                                },
                                {
                                    id: 5,
                                    name: "Plug & Go",
                                    is_selected: false
                                }
                            ]
                        },
                        {
                            id: 65,
                            name: "Fleet OBD Report",
                            usecase_id: 1,
                            packages: [
                                {
                                    id: 7,
                                    name: "Advance Plus",
                                    is_selected: true
                                },
                                {
                                    id: 6,
                                    name: "Advance",
                                    is_selected: true
                                },
                                {
                                    id: 5,
                                    name: "Plug & Go",
                                    is_selected: false
                                }
                            ]
                        },
                        {
                            id: 64,
                            name: "Fleet maintenance reports",
                            usecase_id: 1,
                            packages: [
                                {
                                    id: 7,
                                    name: "Advance Plus",
                                    is_selected: true
                                },
                                {
                                    id: 6,
                                    name: "Advance",
                                    is_selected: true
                                },
                                {
                                    id: 5,
                                    name: "Plug & Go",
                                    is_selected: false
                                }
                            ]
                        },
                        {
                            id: 63,
                            name: "Audit reports",
                            usecase_id: 1,
                            packages: [
                                {
                                    id: 7,
                                    name: "Advance Plus",
                                    is_selected: true
                                },
                                {
                                    id: 6,
                                    name: "Advance",
                                    is_selected: true
                                },
                                {
                                    id: 5,
                                    name: "Plug & Go",
                                    is_selected: true
                                }
                            ]
                        },
                        {
                            id: 62,
                            name: "Predictive Maintenance reports",
                            usecase_id: 1,
                            packages: [
                                {
                                    id: 7,
                                    name: "Advance Plus",
                                    is_selected: true
                                },
                                {
                                    id: 6,
                                    name: "Advance",
                                    is_selected: true
                                },
                                {
                                    id: 5,
                                    name: "Plug & Go",
                                    is_selected: false
                                }
                            ]
                        },
                        {
                            id: 61,
                            name: "Vehicle over speeding reports ",
                            usecase_id: 1,
                            packages: [
                                {
                                    id: 7,
                                    name: "Advance Plus",
                                    is_selected: true
                                },
                                {
                                    id: 6,
                                    name: "Advance",
                                    is_selected: true
                                },
                                {
                                    id: 5,
                                    name: "Plug & Go",
                                    is_selected: false
                                }
                            ]
                        },
                        {
                            id: 60,
                            name: "Trip anomaly report ",
                            usecase_id: 1,
                            packages: [
                                {
                                    id: 7,
                                    name: "Advance Plus",
                                    is_selected: true
                                },
                                {
                                    id: 6,
                                    name: "Advance",
                                    is_selected: true
                                },
                                {
                                    id: 5,
                                    name: "Plug & Go",
                                    is_selected: false
                                }
                            ]
                        },
                        {
                            id: 59,
                            name: "Vehicle summary report",
                            usecase_id: 1,
                            packages: [
                                {
                                    id: 7,
                                    name: "Advance Plus",
                                    is_selected: true
                                },
                                {
                                    id: 6,
                                    name: "Advance",
                                    is_selected: true
                                },
                                {
                                    id: 5,
                                    name: "Plug & Go",
                                    is_selected: true
                                }
                            ]
                        },
                        {
                            id: 58,
                            name: "Driver profile report",
                            usecase_id: 1,
                            packages: [
                                {
                                    id: 7,
                                    name: "Advance Plus",
                                    is_selected: true
                                },
                                {
                                    id: 6,
                                    name: "Advance",
                                    is_selected: true
                                },
                                {
                                    id: 5,
                                    name: "Plug & Go",
                                    is_selected: true
                                }
                            ]
                        },
                        {
                            id: 57,
                            name: "Driver score card report",
                            usecase_id: 1,
                            packages: [
                                {
                                    id: 7,
                                    name: "Advance Plus",
                                    is_selected: true
                                },
                                {
                                    id: 6,
                                    name: "Advance",
                                    is_selected: true
                                },
                                {
                                    id: 5,
                                    name: "Plug & Go",
                                    is_selected: true
                                }
                            ]
                        },
                        {
                            id: 56,
                            name: "Fuel level reporting",
                            usecase_id: 1,
                            packages: [
                                {
                                    id: 7,
                                    name: "Advance Plus",
                                    is_selected: true
                                },
                                {
                                    id: 6,
                                    name: "Advance",
                                    is_selected: false
                                },
                                {
                                    id: 5,
                                    name: "Plug & Go",
                                    is_selected: false
                                }
                            ]
                        },
                        {
                            id: 55,
                            name: "Trip summary report",
                            usecase_id: 1,
                            packages: [
                                {
                                    id: 7,
                                    name: "Advance Plus",
                                    is_selected: true
                                },
                                {
                                    id: 6,
                                    name: "Advance",
                                    is_selected: true
                                },
                                {
                                    id: 5,
                                    name: "Plug & Go",
                                    is_selected: true
                                }
                            ]
                        },
                        {
                            id: 54,
                            name: "Location and movement reports",
                            usecase_id: 1,
                            packages: [
                                {
                                    id: 7,
                                    name: "Advance Plus",
                                    is_selected: true
                                },
                                {
                                    id: 6,
                                    name: "Advance",
                                    is_selected: true
                                },
                                {
                                    id: 5,
                                    name: "Plug & Go",
                                    is_selected: true
                                }
                            ]
                        },
                        {
                            id: 53,
                            name: "Geo fence entry / exit reports",
                            usecase_id: 1,
                            packages: [
                                {
                                    id: 7,
                                    name: "Advance Plus",
                                    is_selected: true
                                },
                                {
                                    id: 6,
                                    name: "Advance",
                                    is_selected: true
                                },
                                {
                                    id: 5,
                                    name: "Plug & Go",
                                    is_selected: true
                                }
                            ]
                        },
                        {
                            id: 52,
                            name: "Geo fence violation reports",
                            usecase_id: 1,
                            packages: [
                                {
                                    id: 7,
                                    name: "Advance Plus",
                                    is_selected: true
                                },
                                {
                                    id: 6,
                                    name: "Advance",
                                    is_selected: true
                                },
                                {
                                    id: 5,
                                    name: "Plug & Go",
                                    is_selected: true
                                }
                            ]
                        },
                        {
                            id: 51,
                            name: "Driver vehicle usage report",
                            usecase_id: 1,
                            packages: [
                                {
                                    id: 7,
                                    name: "Advance Plus",
                                    is_selected: true
                                },
                                {
                                    id: 6,
                                    name: "Advance",
                                    is_selected: true
                                },
                                {
                                    id: 5,
                                    name: "Plug & Go",
                                    is_selected: true
                                }
                            ]
                        },
                        {
                            id: 50,
                            name: "Create and manage geo Routes",
                            usecase_id: 1,
                            packages: [
                                {
                                    id: 7,
                                    name: "Advance Plus",
                                    is_selected: true
                                },
                                {
                                    id: 6,
                                    name: "Advance",
                                    is_selected: true
                                },
                                {
                                    id: 5,
                                    name: "Plug & Go",
                                    is_selected: false
                                }
                            ]
                        },
                        {
                            id: 49,
                            name: "Geozones based near real time tracking using Maps interface",
                            usecase_id: 1,
                            packages: [
                                {
                                    id: 7,
                                    name: "Advance Plus",
                                    is_selected: true
                                },
                                {
                                    id: 6,
                                    name: "Advance",
                                    is_selected: true
                                },
                                {
                                    id: 5,
                                    name: "Plug & Go",
                                    is_selected: true
                                }
                            ]
                        },
                        {
                            id: 48,
                            name: "Polygon / circle based geo zones creation",
                            usecase_id: 1,
                            packages: [
                                {
                                    id: 7,
                                    name: "Advance Plus",
                                    is_selected: true
                                },
                                {
                                    id: 6,
                                    name: "Advance",
                                    is_selected: true
                                },
                                {
                                    id: 5,
                                    name: "Plug & Go",
                                    is_selected: true
                                }
                            ]
                        },
                        {
                            id: 47,
                            name: "Geozones based historic tracking using Maps interface ",
                            usecase_id: 1,
                            packages: [
                                {
                                    id: 7,
                                    name: "Advance Plus",
                                    is_selected: true
                                },
                                {
                                    id: 6,
                                    name: "Advance",
                                    is_selected: true
                                },
                                {
                                    id: 5,
                                    name: "Plug & Go",
                                    is_selected: true
                                }
                            ]
                        },
                        {
                            id: 46,
                            name: "Create and manage geo zones, routes, POI and POI groups",
                            usecase_id: 1,
                            packages: [
                                {
                                    id: 7,
                                    name: "Advance Plus",
                                    is_selected: true
                                },
                                {
                                    id: 6,
                                    name: "Advance",
                                    is_selected: true
                                },
                                {
                                    id: 5,
                                    name: "Plug & Go",
                                    is_selected: true
                                }
                            ]
                        },
                        {
                            id: 45,
                            name: "Fleet status display",
                            usecase_id: 1,
                            packages: [
                                {
                                    id: 7,
                                    name: "Advance Plus",
                                    is_selected: true
                                },
                                {
                                    id: 6,
                                    name: "Advance",
                                    is_selected: true
                                },
                                {
                                    id: 5,
                                    name: "Plug & Go",
                                    is_selected: true
                                }
                            ]
                        },
                        {
                            id: 44,
                            name: "Filters on vehicle groups, zones or POI for tracking fleet",
                            usecase_id: 1,
                            packages: [
                                {
                                    id: 7,
                                    name: "Advance Plus",
                                    is_selected: true
                                },
                                {
                                    id: 6,
                                    name: "Advance",
                                    is_selected: true
                                },
                                {
                                    id: 5,
                                    name: "Plug & Go",
                                    is_selected: true
                                }
                            ]
                        },
                        {
                            id: 43,
                            name: "Time stamps on fleet and trips",
                            usecase_id: 1,
                            packages: [
                                {
                                    id: 7,
                                    name: "Advance Plus",
                                    is_selected: true
                                },
                                {
                                    id: 6,
                                    name: "Advance",
                                    is_selected: true
                                },
                                {
                                    id: 5,
                                    name: "Plug & Go",
                                    is_selected: true
                                }
                            ]
                        },
                        {
                            id: 42,
                            name: "Historic fleet tracking using Maps interface",
                            usecase_id: 1,
                            packages: [
                                {
                                    id: 7,
                                    name: "Advance Plus",
                                    is_selected: true
                                },
                                {
                                    id: 6,
                                    name: "Advance",
                                    is_selected: true
                                },
                                {
                                    id: 5,
                                    name: "Plug & Go",
                                    is_selected: true
                                }
                            ]
                        },
                        {
                            id: 41,
                            name: "Near real time fleet tracking using tabular interface",
                            usecase_id: 1,
                            packages: [
                                {
                                    id: 7,
                                    name: "Advance Plus",
                                    is_selected: true
                                },
                                {
                                    id: 6,
                                    name: "Advance",
                                    is_selected: true
                                },
                                {
                                    id: 5,
                                    name: "Plug & Go",
                                    is_selected: true
                                }
                            ]
                        },
                        {
                            id: 40,
                            name: "Near real time fleet tracking using Maps interface",
                            usecase_id: 1,
                            packages: [
                                {
                                    id: 7,
                                    name: "Advance Plus",
                                    is_selected: true
                                },
                                {
                                    id: 6,
                                    name: "Advance",
                                    is_selected: true
                                },
                                {
                                    id: 5,
                                    name: "Plug & Go",
                                    is_selected: true
                                }
                            ]
                        },
                        {
                            id: 39,
                            name: "Driver job / trip completion workflow",
                            usecase_id: 1,
                            packages: [
                                {
                                    id: 7,
                                    name: "Advance Plus",
                                    is_selected: true
                                },
                                {
                                    id: 6,
                                    name: "Advance",
                                    is_selected: true
                                },
                                {
                                    id: 5,
                                    name: "Plug & Go",
                                    is_selected: false
                                }
                            ]
                        },
                        {
                            id: 38,
                            name: "Allocate jobs / trips for drivers",
                            usecase_id: 1,
                            packages: [
                                {
                                    id: 7,
                                    name: "Advance Plus",
                                    is_selected: true
                                },
                                {
                                    id: 6,
                                    name: "Advance",
                                    is_selected: true
                                },
                                {
                                    id: 5,
                                    name: "Plug & Go",
                                    is_selected: false
                                }
                            ]
                        },
                        {
                            id: 37,
                            name: "Allocate shifts for drivers",
                            usecase_id: 1,
                            packages: [
                                {
                                    id: 7,
                                    name: "Advance Plus",
                                    is_selected: true
                                },
                                {
                                    id: 6,
                                    name: "Advance",
                                    is_selected: true
                                },
                                {
                                    id: 5,
                                    name: "Plug & Go",
                                    is_selected: false
                                }
                            ]
                        },
                        {
                            id: 36,
                            name: "Create and manage shifts for drivers",
                            usecase_id: 1,
                            packages: [
                                {
                                    id: 7,
                                    name: "Advance Plus",
                                    is_selected: true
                                },
                                {
                                    id: 6,
                                    name: "Advance",
                                    is_selected: true
                                },
                                {
                                    id: 5,
                                    name: "Plug & Go",
                                    is_selected: false
                                }
                            ]
                        },
                        {
                            id: 35,
                            name: "Driver job / trip dashboard view",
                            usecase_id: 1,
                            packages: [
                                {
                                    id: 7,
                                    name: "Advance Plus",
                                    is_selected: true
                                },
                                {
                                    id: 6,
                                    name: "Advance",
                                    is_selected: true
                                },
                                {
                                    id: 5,
                                    name: "Plug & Go",
                                    is_selected: false
                                }
                            ]
                        },
                        {
                            id: 34,
                            name: "Device telemetric definition and management",
                            usecase_id: 1,
                            packages: [
                                {
                                    id: 7,
                                    name: "Advance Plus",
                                    is_selected: true
                                },
                                {
                                    id: 6,
                                    name: "Advance",
                                    is_selected: true
                                },
                                {
                                    id: 5,
                                    name: "Plug & Go",
                                    is_selected: false
                                }
                            ]
                        },
                        {
                            id: 33,
                            name: "Display device information in the system",
                            usecase_id: 1,
                            packages: [
                                {
                                    id: 7,
                                    name: "Advance Plus",
                                    is_selected: true
                                },
                                {
                                    id: 6,
                                    name: "Advance",
                                    is_selected: true
                                },
                                {
                                    id: 5,
                                    name: "Plug & Go",
                                    is_selected: true
                                }
                            ]
                        },
                        {
                            id: 32,
                            name: "SIM mapping and display in the system ",
                            usecase_id: 1,
                            packages: [
                                {
                                    id: 7,
                                    name: "Advance Plus",
                                    is_selected: true
                                },
                                {
                                    id: 6,
                                    name: "Advance",
                                    is_selected: true
                                },
                                {
                                    id: 5,
                                    name: "Plug & Go",
                                    is_selected: true
                                }
                            ]
                        },
                        {
                            id: 31,
                            name: "Associate contracts and features to the customer",
                            usecase_id: 1,
                            packages: [
                                {
                                    id: 7,
                                    name: "Advance Plus",
                                    is_selected: true
                                },
                                {
                                    id: 6,
                                    name: "Advance",
                                    is_selected: true
                                },
                                {
                                    id: 5,
                                    name: "Plug & Go",
                                    is_selected: false
                                }
                            ]
                        },
                        {
                            id: 30,
                            name: "Create and manage customers for the system",
                            usecase_id: 1,
                            packages: [
                                {
                                    id: 7,
                                    name: "Advance Plus",
                                    is_selected: true
                                },
                                {
                                    id: 6,
                                    name: "Advance",
                                    is_selected: true
                                },
                                {
                                    id: 5,
                                    name: "Plug & Go",
                                    is_selected: false
                                }
                            ]
                        },
                        {
                            id: 29,
                            name: "Associate roles and permissions to the users",
                            usecase_id: 1,
                            packages: [
                                {
                                    id: 7,
                                    name: "Advance Plus",
                                    is_selected: true
                                },
                                {
                                    id: 6,
                                    name: "Advance",
                                    is_selected: true
                                },
                                {
                                    id: 5,
                                    name: "Plug & Go",
                                    is_selected: true
                                }
                            ]
                        },
                        {
                            id: 28,
                            name: "Create and manage system users",
                            usecase_id: 1,
                            packages: [
                                {
                                    id: 7,
                                    name: "Advance Plus",
                                    is_selected: true
                                },
                                {
                                    id: 6,
                                    name: "Advance",
                                    is_selected: true
                                },
                                {
                                    id: 5,
                                    name: "Plug & Go",
                                    is_selected: false
                                }
                            ]
                        },
                        {
                            id: 27,
                            name: "Role based user access ",
                            usecase_id: 1,
                            packages: [
                                {
                                    id: 7,
                                    name: "Advance Plus",
                                    is_selected: true
                                },
                                {
                                    id: 6,
                                    name: "Advance",
                                    is_selected: true
                                },
                                {
                                    id: 5,
                                    name: "Plug & Go",
                                    is_selected: true
                                }
                            ]
                        },
                        {
                            id: 26,
                            name: "User profile self management",
                            usecase_id: 1,
                            packages: [
                                {
                                    id: 7,
                                    name: "Advance Plus",
                                    is_selected: true
                                },
                                {
                                    id: 6,
                                    name: "Advance",
                                    is_selected: true
                                },
                                {
                                    id: 5,
                                    name: "Plug & Go",
                                    is_selected: true
                                }
                            ]
                        },
                        {
                            id: 25,
                            name: "Reset/Change password for first time users",
                            usecase_id: 1,
                            packages: [
                                {
                                    id: 7,
                                    name: "Advance Plus",
                                    is_selected: true
                                },
                                {
                                    id: 6,
                                    name: "Advance",
                                    is_selected: true
                                },
                                {
                                    id: 5,
                                    name: "Plug & Go",
                                    is_selected: true
                                }
                            ]
                        },
                        {
                            id: 24,
                            name: "Forgot password for existing users",
                            usecase_id: 1,
                            packages: [
                                {
                                    id: 7,
                                    name: "Advance Plus",
                                    is_selected: true
                                },
                                {
                                    id: 6,
                                    name: "Advance",
                                    is_selected: true
                                },
                                {
                                    id: 5,
                                    name: "Plug & Go",
                                    is_selected: true
                                }
                            ]
                        },
                        {
                            id: 23,
                            name: "Login capabilities for both first time and returning users",
                            usecase_id: 1,
                            packages: [
                                {
                                    id: 7,
                                    name: "Advance Plus",
                                    is_selected: true
                                },
                                {
                                    id: 6,
                                    name: "Advance",
                                    is_selected: true
                                },
                                {
                                    id: 5,
                                    name: "Plug & Go",
                                    is_selected: true
                                }
                            ]
                        },
                        {
                            id: 22,
                            name: "Generate passwords for first time users",
                            usecase_id: 1,
                            packages: [
                                {
                                    id: 7,
                                    name: "Advance Plus",
                                    is_selected: true
                                },
                                {
                                    id: 6,
                                    name: "Advance",
                                    is_selected: true
                                },
                                {
                                    id: 5,
                                    name: "Plug & Go",
                                    is_selected: true
                                }
                            ]
                        },
                        {
                            id: 21,
                            name: "Automatic fuel readings",
                            usecase_id: 1,
                            packages: [
                                {
                                    id: 7,
                                    name: "Advance Plus",
                                    is_selected: true
                                },
                                {
                                    id: 6,
                                    name: "Advance",
                                    is_selected: false
                                },
                                {
                                    id: 5,
                                    name: "Plug & Go",
                                    is_selected: false
                                }
                            ]
                        },
                        {
                            id: 20,
                            name: "Fuel readings details view ",
                            usecase_id: 1,
                            packages: [
                                {
                                    id: 7,
                                    name: "Advance Plus",
                                    is_selected: true
                                },
                                {
                                    id: 6,
                                    name: "Advance",
                                    is_selected: false
                                },
                                {
                                    id: 5,
                                    name: "Plug & Go",
                                    is_selected: false
                                }
                            ]
                        },
                        {
                            id: 19,
                            name: "Manual fuel entry",
                            usecase_id: 1,
                            packages: [
                                {
                                    id: 7,
                                    name: "Advance Plus",
                                    is_selected: true
                                },
                                {
                                    id: 6,
                                    name: "Advance",
                                    is_selected: true
                                },
                                {
                                    id: 5,
                                    name: "Plug & Go",
                                    is_selected: true
                                }
                            ]
                        },
                        {
                            id: 18,
                            name: "Driver performance information",
                            usecase_id: 1,
                            packages: [
                                {
                                    id: 7,
                                    name: "Advance Plus",
                                    is_selected: true
                                },
                                {
                                    id: 6,
                                    name: "Advance",
                                    is_selected: true
                                },
                                {
                                    id: 5,
                                    name: "Plug & Go",
                                    is_selected: false
                                }
                            ]
                        },
                        {
                            id: 17,
                            name: "Manage Shifts",
                            usecase_id: 1,
                            packages: [
                                {
                                    id: 7,
                                    name: "Advance Plus",
                                    is_selected: true
                                },
                                {
                                    id: 6,
                                    name: "Advance",
                                    is_selected: true
                                },
                                {
                                    id: 5,
                                    name: "Plug & Go",
                                    is_selected: false
                                }
                            ]
                        },
                        {
                            id: 16,
                            name: "Driver dashboard views",
                            usecase_id: 1,
                            packages: [
                                {
                                    id: 7,
                                    name: "Advance Plus",
                                    is_selected: true
                                },
                                {
                                    id: 6,
                                    name: "Advance",
                                    is_selected: true
                                },
                                {
                                    id: 5,
                                    name: "Plug & Go",
                                    is_selected: false
                                }
                            ]
                        },
                        {
                            id: 15,
                            name: "Driver behavior identification (harsh breaking, acceleration, declaration, overspeed etc.)",
                            usecase_id: 1,
                            packages: [
                                {
                                    id: 7,
                                    name: "Advance Plus",
                                    is_selected: true
                                },
                                {
                                    id: 6,
                                    name: "Advance",
                                    is_selected: true
                                },
                                {
                                    id: 5,
                                    name: "Plug & Go",
                                    is_selected: true
                                }
                            ]
                        },
                        {
                            id: 14,
                            name: "Create and manage groups of drivers",
                            usecase_id: 1,
                            packages: [
                                {
                                    id: 7,
                                    name: "Advance Plus",
                                    is_selected: true
                                },
                                {
                                    id: 6,
                                    name: "Advance",
                                    is_selected: true
                                },
                                {
                                    id: 5,
                                    name: "Plug & Go",
                                    is_selected: false
                                }
                            ]
                        },
                        {
                            id: 13,
                            name: "Allocate driver to vehicles",
                            usecase_id: 1,
                            packages: [
                                {
                                    id: 7,
                                    name: "Advance Plus",
                                    is_selected: true
                                },
                                {
                                    id: 6,
                                    name: "Advance",
                                    is_selected: true
                                },
                                {
                                    id: 5,
                                    name: "Plug & Go",
                                    is_selected: false
                                }
                            ]
                        },
                        {
                            id: 12,
                            name: "Display driver details",
                            usecase_id: 1,
                            packages: [
                                {
                                    id: 7,
                                    name: "Advance Plus",
                                    is_selected: true
                                },
                                {
                                    id: 6,
                                    name: "Advance",
                                    is_selected: true
                                },
                                {
                                    id: 5,
                                    name: "Plug & Go",
                                    is_selected: false
                                }
                            ]
                        },
                        {
                            id: 11,
                            name: "Create and manage drivers",
                            usecase_id: 1,
                            packages: [
                                {
                                    id: 7,
                                    name: "Advance Plus",
                                    is_selected: true
                                },
                                {
                                    id: 6,
                                    name: "Advance",
                                    is_selected: true
                                },
                                {
                                    id: 5,
                                    name: "Plug & Go",
                                    is_selected: false
                                }
                            ]
                        },
                        {
                            id: 10,
                            name: "Allocate fleet to routes ",
                            usecase_id: 1,
                            packages: [
                                {
                                    id: 7,
                                    name: "Advance Plus",
                                    is_selected: true
                                },
                                {
                                    id: 6,
                                    name: "Advance",
                                    is_selected: true
                                },
                                {
                                    id: 5,
                                    name: "Plug & Go",
                                    is_selected: false
                                }
                            ]
                        },
                        {
                            id: 9,
                            name: "Define and manage vehicle types master data",
                            usecase_id: 1,
                            packages: [
                                {
                                    id: 7,
                                    name: "Advance Plus",
                                    is_selected: true
                                },
                                {
                                    id: 6,
                                    name: "Advance",
                                    is_selected: true
                                },
                                {
                                    id: 5,
                                    name: "Plug & Go",
                                    is_selected: true
                                }
                            ]
                        },
                        {
                            id: 8,
                            name: "Allocate fleet to geozones",
                            usecase_id: 1,
                            packages: [
                                {
                                    id: 7,
                                    name: "Advance Plus",
                                    is_selected: true
                                },
                                {
                                    id: 6,
                                    name: "Advance",
                                    is_selected: true
                                },
                                {
                                    id: 5,
                                    name: "Plug & Go",
                                    is_selected: true
                                }
                            ]
                        },
                        {
                            id: 7,
                            name: "Map fleet with devices",
                            usecase_id: 1,
                            packages: [
                                {
                                    id: 7,
                                    name: "Advance Plus",
                                    is_selected: true
                                },
                                {
                                    id: 6,
                                    name: "Advance",
                                    is_selected: true
                                },
                                {
                                    id: 5,
                                    name: "Plug & Go",
                                    is_selected: true
                                }
                            ]
                        },
                        {
                            id: 6,
                            name: "Display fleet details",
                            usecase_id: 1,
                            packages: [
                                {
                                    id: 7,
                                    name: "Advance Plus",
                                    is_selected: true
                                },
                                {
                                    id: 6,
                                    name: "Advance",
                                    is_selected: true
                                },
                                {
                                    id: 5,
                                    name: "Plug & Go",
                                    is_selected: true
                                }
                            ]
                        },
                        {
                            id: 5,
                            name: "Create and manage fleet",
                            usecase_id: 1,
                            packages: [
                                {
                                    id: 7,
                                    name: "Advance Plus",
                                    is_selected: true
                                },
                                {
                                    id: 6,
                                    name: "Advance",
                                    is_selected: true
                                },
                                {
                                    id: 5,
                                    name: "Plug & Go",
                                    is_selected: true
                                }
                            ]
                        },
                        {
                            id: 4,
                            name: "Maintenance dashboard views",
                            usecase_id: 1,
                            packages: [
                                {
                                    id: 7,
                                    name: "Advance Plus",
                                    is_selected: true
                                },
                                {
                                    id: 6,
                                    name: "Advance",
                                    is_selected: true
                                },
                                {
                                    id: 5,
                                    name: "Plug & Go",
                                    is_selected: false
                                }
                            ]
                        },
                        {
                            id: 3,
                            name: "Driver dashboard views",
                            usecase_id: 1,
                            packages: [
                                {
                                    id: 7,
                                    name: "Advance Plus",
                                    is_selected: true
                                },
                                {
                                    id: 6,
                                    name: "Advance",
                                    is_selected: true
                                },
                                {
                                    id: 5,
                                    name: "Plug & Go",
                                    is_selected: false
                                }
                            ]
                        },
                        {
                            id: 2,
                            name: "Overall summary dashboard",
                            usecase_id: 1,
                            packages: [
                                {
                                    id: 7,
                                    name: "Advance Plus",
                                    is_selected: true
                                },
                                {
                                    id: 6,
                                    name: "Advance",
                                    is_selected: true
                                },
                                {
                                    id: 5,
                                    name: "Plug & Go",
                                    is_selected: true
                                }
                            ]
                        },
                        {
                            id: 1,
                            name: "Fleet dashboards",
                            usecase_id: 1,
                            packages: [
                                {
                                    id: 7,
                                    name: "Advance Plus",
                                    is_selected: true
                                },
                                {
                                    id: 6,
                                    name: "Advance",
                                    is_selected: true
                                },
                                {
                                    id: 5,
                                    name: "Plug & Go",
                                    is_selected: true
                                }
                            ]
                        }
                    ]
                }
            ]
        };
        this.newData = [];
        this.active = 0;
        this.lastUId = 0;

    }

    ngOnInit(): void {
        this.data = {};
        this.checkPermission();
        this.getUsecases();
    }

    checkPermission() {
        let perm = this.checkPermService.checkPermissions();
        this.readonly = perm && perm.length > 0 && perm.includes('RW') ? false : true;
    }

    getUsecases() {
        this.loading = true;
        let slug = `${environment.pkgms}/packages/usecases`;
        this.apiService.get(slug).subscribe((resp: ApiResponse) => {
            let data = resp.data['data'];
            data.forEach((element: any) => {
                this.usecases.push(element);
            });

            if (this.usecases.length === 0) {
                this.loading = false;
            } else {
                const usecaseId = this.usecases[0].id;
                const usecaseName = this.usecases[0].usecase_name;
                this.active = usecaseId;

                // if (usecaseName === 'Fleet Management System' || usecaseName === 'Asset Tracking') {
                //     const modId = this.usecases[0]?.id;
                //     // this.getOldPkgs(modId, usecaseId);
                //     this.packageATDashboard()
                //     this.packageATAssets()
                //     this.packageATAssetInventory()
                //     this.packageATUserandAdmin()
                //     this.packageATReports()
                //     this.packageATAuditandDocument()
                //     this.packageATApps()
                //     this.packageATAssetAllocate()
                // } else {
                    this.getData(usecaseId);
                // }
            }
        }, (err: any) => {
            this.loading = false;
            const status = err.error['status'];
            const statusCodes = [401, 2, 3, 11, 151, 153, 18, 300, 301];
            if (statusCodes.includes(status)) {
                this.toastrService.error(err.error['message'], 'Access Unauthorized', {
                    progressBar: true, progressAnimation: 'decreasing', timeOut: 3000
                });
            } else {
                this.toastrService.error(err.error['message'], 'Error getting usecases', {
                    progressBar: true, progressAnimation: 'decreasing', timeOut: 3000
                });
            }
        });
    }

    getData(id: number, removeOldData: boolean = false) {
        // console.log("id=== > ", id)
        this.loading = true;
        this.lastUId = id;
        if (removeOldData) {
            this.data = {};
        }
        let slug = `${environment.pkgms}/packages/?id=${id}`;
        this.apiService.get(slug).subscribe((resp: ApiResponse) => {
            let data = resp.data['data'];
            this.data = data;
            this.loading = false;
        }, (err: any) => {
            this.loading = false;
            this.toastrService.error(err.error['message'], 'Error getting packages data', {
                progressAnimation: 'decreasing', progressBar: true, timeOut: 3000
            });
        });

        // get data for `Asset Tracking tab`
        // if (id === 6) {
        //     this.packageATDashboard()
        //     this.packageATAssets()
        //     this.packageATAssetInventory()
        //     this.packageATUserandAdmin()
        //     this.packageATReports()
        //     this.packageATAuditandDocument()
        //     this.packageATApps()
        //     this.packageATAssetAllocate()
        // }
    }

    getSortedArray(data: any[]) {
        let st = data.sort((a, b) => (a.name > b.name ? 1 : -1));
        return st;
    }

    getSortedNames(data: any[]) {
        let st = data.sort((a, b) => (a.package_name > b.package_name ? 1 : -1));
        return st;
    }

    // getOldPkgs(modId: number, usecaseId: number) {
    //     this.loading = false;
    //     // this.data = this.fmsData;
    //     // const slug = `${environment.cobOld}/api/users/get_features_packages/?module_id=${modId}&usecase_id=${usecaseId}`;
    //     // this.apiService.get(slug).subscribe((resp: ApiResponse) => {
    //     //     this.fmsData = resp.data;
    //     //     this.loading = false;
    //     // }, (err: any) => {
    //     //     console.log(err);
    //     //     this.loading = false;
    //     //     // this.toastrService.error(err)
    //     // });
    // }

    onAddFeature(moduleId: number, usecaseId: number, ev?: any) {
        event?.stopPropagation();

        const modalRef = this.modal.open(FeatureFormComponent, { size: 'sm', scrollable: true });

        if (!!ev) {
            modalRef.componentInstance.data = ev;
            modalRef.componentInstance.title = 'Edit Feature';
        }
        modalRef.componentInstance.moduleId = moduleId;
        modalRef.componentInstance.usecaseId = usecaseId;

        modalRef.closed.subscribe(() => {
            this.getData(usecaseId);
        })
    }

    onDeleteFeature(mId: number, uId: number, ev: any) {
        let slug = `${environment.pkgms}/packages/?id=${ev.id}`;
        AlertService.confirm('Are you sure?', 'You want to delete this feature?', 'Yes').subscribe((resp: VAlertAction) => {
            if (resp.positive) {
                this.apiService.delete(slug).subscribe((resp: ApiResponse) => {
                    this.toastrService.success(resp.message, 'Successfully Deleted', {
                        progressBar: true, progressAnimation: 'decreasing', timeOut: 3000
                    });
                    this.getData(uId);
                }, (err: any) => {
                    this.toastrService.error(err.error['message'], 'Error deleting feature', {
                        progressBar: true, progressAnimation: 'decreasing', timeOut: 3000
                    });
                });
            } else {
                return;
            }
        });
    }

    onSelectPackage(pack: any) {
        this.newData = [];
        for (let i = 0; i < this.data.modules.length; i++) {
            let features = this.data.modules[i].features;
            for (let j = 0; j < features.length; j++) {
                let packages = this.data.modules[i].features[j].packages;
                for (let k = 0; k < packages.length; k++) {
                    if (packages[k].is_active) {
                        this.newData.push({ id: packages[k].id, is_active: packages[k].is_active });
                    } else {
                        this.newData.push({ id: packages[k].id, is_active: packages[k].is_active });
                    }
                }
            }
        }
        // console.log('final data ==== ', this.newData);
    }

    onSave(nav: any) {
        // console.log("nav== ", nav?.activeId)
        // if (nav?.activeId == 6) {
        //     //Asset Tracking tab is selected
        //     // console.log("this.packagefeaturelist= ", this.packagefeaturelist)

        //     let slug = `${environment.cobOld}/api/users/changepackagefeature/`;
        //     this.apiService.post(slug, this.packagefeaturelist).subscribe((response: ApiResponse) => {
        //         if (!response.error) {
        //             this.toastrService.success('Record Updated Successfully', '', {
        //                 progressBar: true,
        //                 progressAnimation: "decreasing",
        //                 timeOut: 3000,
        //             })
        //             this.packagefeaturelist = []
        //             this.newData = []
        //         } else {
        //             this.toastrService.error('Unable to update package', '', {
        //                 progressBar: true,
        //                 progressAnimation: "decreasing",
        //                 timeOut: 3000,
        //             })
        //         }
        //     }, err => {
        //         this.toastrService.error(err['error']['detail'], '', {
        //             progressBar: true,
        //             progressAnimation: "decreasing",
        //             timeOut: 3000,
        //         })
        //     })

        // } else {
            //FMS or AT tab is selected
            let slug = `${environment.pkgms}/packages/usecases`;
            let payload = { package_plan: this.newData };
            // console.log("payload= ", payload)
            this.apiService.patch(slug, payload).subscribe((resp: ApiResponse) => {
                this.toastrService.success(resp.message, 'Success', {
                    progressBar: true, progressAnimation: 'decreasing', timeOut: 3000
                });
                this.getData(this.lastUId);
            }, (err: any) => {
                this.toastrService.error(err.error['message'], 'Error updating package plan', {
                    progressBar: true, progressAnimation: 'decreasing', timeOut: 3000
                });
            });
        // }
    }

    packageATDashboard() {
        const slug = `${environment.cobOld}/api/users/get_features_packages/?module_id=6&usecase_id=2&category=Dashboard`;
        this.apiService.get(slug).subscribe((resp: ApiResponse) => {
            this.responseOFATAPI = resp.data;
            // console.log("this.responseOFATAPI(after getFeaturesAndPackages())= ", this.responseOFATAPI);

            if (!resp.error) {
                // LOOP ON FEATURES[]
                this.responseOFATAPI.features.forEach((elem: any) => {
                    elem.packages.forEach((element: any) => {
                        if (element.is_selected) {
                            element.is_selected = true;
                        } else {
                            element.is_selected = false;
                        }
                    });
                })

                // LOOP ON PACKAGES[]
                // if there are no features against a usecase then dont fill the packages inputs
                if (this.responseOFATAPI.features.length == 0) {
                    //show error swal alert of no packages
                    this.toastrService.error('You cannot select this usecase as there is no feature against this usecase');
                } else {
                    if (this.responseOFATAPI.packages.length == 0) {
                        //show error swal alert of no packages
                        this.toastrService.error('You cannot select this usecase as there is no package against this usecase');
                        // this.packagesAvailable = false;
                    } else {
                        // this.packagesAvailable = true;
                    }
                }

            } else {
                this.toastrService.error(resp.message);
            }

        }, (err: any) => {
            console.log(err);
            // this.toastrService.error(err)
        });
    }

    packageATAssets() {
        const slug = `${environment.cobOld}/api/users/get_features_packages/?module_id=6&usecase_id=2&category=Assets`;
        this.apiService.get(slug).subscribe((assetResp: ApiResponse) => {
            this.responseOFATDashboardAPI = assetResp.data;
            // console.log("this.responseOFATDashboardAPI(after getFeaturesAndPackages())= ", this.responseOFATDashboardAPI);

            if (!assetResp.error) {
                // LOOP ON FEATURES[]
                this.responseOFATDashboardAPI.features.forEach((elem: any) => {
                    // console.log("elem======= ", elem);
                    elem.packages.forEach((element: any) => {
                        if (element.is_selected) {
                            element.is_selected = true;
                        } else {
                            element.is_selected = false;
                        }
                    });
                })

                // LOOP ON PACKAGES[]
                // if there are no features against a usecase then dont fill the packages inputs
                if (this.responseOFATDashboardAPI.features.length == 0) {
                    //show error swal alert of no packages
                    this.toastrService.error('You cannot select this usecase as there is no feature against this usecase');
                } else {
                    if (this.responseOFATDashboardAPI.packages.length == 0) {
                        //show error swal alert of no packages
                        this.toastrService.error('You cannot select this usecase as there is no package against this usecase');
                        // this.packagesAvailable = false;
                    } else {
                        // this.packagesAvailable = true;
                    }
                }
            } else {
                this.toastrService.error(assetResp.message);
            }
        })
    }

    packageATAssetInventory() {
        const slug = `${environment.cobOld}/api/users/get_features_packages/?module_id=6&usecase_id=2&category=Assets Inventory`;
        this.apiService.get(slug).subscribe((assetInvResp: ApiResponse) => {
            this.responseOFATAlertAPI = assetInvResp.data;
            // console.log("this.responseOFATAlertAPI(after getFeaturesAndPackages())= ", this.responseOFATAlertAPI);
            if (!assetInvResp.error) {
                // LOOP ON FEATURES[]
                this.responseOFATAlertAPI.features.forEach((elem: any) => {
                    elem.packages.forEach((element: any) => {
                        if (element.is_selected) {
                            element.is_selected = true;
                        } else {
                            element.is_selected = false;
                        }
                    });
                })

                // LOOP ON PACKAGES[]
                // if there are no features against a usecase then dont fill the packages inputs
                if (this.responseOFATAlertAPI.features.length == 0) {
                    //show error swal alert of no packages
                    this.toastrService.error('You cannot select this usecase as there is no feature against this usecase');
                } else {
                    if (this.responseOFATAlertAPI.packages.length == 0) {
                        //show error swal alert of no packages
                        this.toastrService.error('You cannot select this usecase as there is no package against this usecase');
                        // this.packagesAvailable = false;
                    } else {
                        // this.packagesAvailable = true;
                    }
                }
            } else {
                this.toastrService.error(assetInvResp.message);
            }
        })

    }

    packageATAssetAllocate() {
        const slug = `${environment.cobOld}/api/users/get_features_packages/?module_id=6&usecase_id=2&category=Allocate/Lease`;
        this.apiService.get(slug).subscribe((leaseResp: ApiResponse) => {
            this.responseOFAAllocateAPI = leaseResp.data;
            // console.log("this.responseOFATAlertAPI(after getFeaturesAndPackages())= ", this.responseOFAAllocateAPI);

            if (!leaseResp.error) {
                // LOOP ON FEATURES[]
                this.responseOFAAllocateAPI.features.forEach((elem: any) => {
                    elem.packages.forEach((element: any) => {
                        if (element.is_selected) {
                            element.is_selected = true;
                        } else {
                            element.is_selected = false;
                        }
                    });
                })

                // LOOP ON PACKAGES[]
                // if there are no features against a usecase then dont fill the packages inputs
                if (this.responseOFAAllocateAPI.features.length == 0) {
                    //show error swal alert of no packages
                    this.toastrService.error('You cannot select this usecase as there is no feature against this usecase');
                } else {
                    if (this.responseOFAAllocateAPI.packages.length == 0) {
                        //show error swal alert of no packages
                        this.toastrService.error('You cannot select this usecase as there is no package against this usecase');
                        // this.packagesAvailable = false;
                    } else {
                        // this.packagesAvailable = true;
                    }
                }
            } else {
                this.toastrService.error(leaseResp.message);
            }
        })
    }

    packageATUserandAdmin() {
        const slug = `${environment.cobOld}/api/users/get_features_packages/?module_id=6&usecase_id=2&category=User and Admin`;
        this.apiService.get(slug).subscribe((userResp: ApiResponse) => {
            this.responseOFATConfigAPI = userResp.data;
            // console.log("this.responseOFATConfigAPI(after getFeaturesAndPackages())= ", this.responseOFATConfigAPI);
            if (!userResp.error) {
                // LOOP ON FEATURES[]
                this.responseOFATConfigAPI.features.forEach((elem: any) => {
                    elem.packages.forEach((element: any) => {
                        if (element.is_selected) {
                            element.is_selected = true;
                        } else {
                            element.is_selected = false;
                        }
                    });
                })

                // LOOP ON PACKAGES[]
                // if there are no features against a usecase then dont fill the packages inputs
                if (this.responseOFATConfigAPI.features.length == 0) {
                    //show error swal alert of no packages
                    this.toastrService.error('You cannot select this usecase as there is no feature against this usecase');
                } else {
                    if (this.responseOFATConfigAPI.packages.length == 0) {
                        //show error swal alert of no packages
                        this.toastrService.error('You cannot select this usecase as there is no package against this usecase');
                        // this.packagesAvailable = false;
                    } else {
                        // this.packagesAvailable = true;
                    }
                }
            } else {
                this.toastrService.error(userResp.message);
            }
        })
    }

    packageATReports() {
        const slug = `${environment.cobOld}/api/users/get_features_packages/?module_id=6&usecase_id=2&category=Reports`;
        this.apiService.get(slug).subscribe((reportsResp: ApiResponse) => {
            this.responseOFATReportsAPI = reportsResp.data;
            // console.log("this.responseOFATReportsAPI(after getFeaturesAndPackages())= ", this.responseOFATReportsAPI);

            if (!reportsResp.error) {
                // LOOP ON FEATURES[]
                this.responseOFATReportsAPI.features.forEach((elem: any) => {
                    elem.packages.forEach((element: any) => {
                        if (element.is_selected) {
                            element.is_selected = true;
                        } else {
                            element.is_selected = false;
                        }
                    });
                })

                // LOOP ON PACKAGES[]
                // if there are no features against a usecase then dont fill the packages inputs
                if (this.responseOFATReportsAPI.features.length == 0) {
                    //show error swal alert of no packages
                    this.toastrService.error('You cannot select this usecase as there is no feature against this usecase');
                } else {
                    if (this.responseOFATReportsAPI.packages.length == 0) {
                        //show error swal alert of no packages
                        this.toastrService.error('You cannot select this usecase as there is no package against this usecase');
                        // this.packagesAvailable = false;
                    } else {
                        // this.packagesAvailable = true;
                    }
                }
            } else {
                this.toastrService.error(reportsResp.message);
            }
        })
    }

    packageATAuditandDocument() {
        const slug = `${environment.cobOld}/api/users/get_features_packages/?module_id=6&usecase_id=2&category=Documents and Audit`;
        this.apiService.get(slug).subscribe((doucResp: ApiResponse) => {
            this.responseOFATAnaysticsAPI = doucResp.data;
            // console.log("this.responseOFATAnaysticsAPI(after getFeaturesAndPackages())= ", this.responseOFATAnaysticsAPI);

            if (!doucResp.error) {
                // LOOP ON FEATURES[]
                this.responseOFATAnaysticsAPI.features.forEach((elem: any) => {
                    elem.packages.forEach((element: any) => {
                        if (element.is_selected) {
                            element.is_selected = true;
                        } else {
                            element.is_selected = false;
                        }
                    });
                })

                // LOOP ON PACKAGES[]
                // if there are no features against a usecase then dont fill the packages inputs
                if (this.responseOFATAnaysticsAPI.features.length == 0) {
                    //show error swal alert of no packages
                    this.toastrService.error('You cannot select this usecase as there is no feature against this usecase');
                } else {
                    if (this.responseOFATAnaysticsAPI.packages.length == 0) {
                        //show error swal alert of no packages
                        this.toastrService.error('You cannot select this usecase as there is no package against this usecase');
                        // this.packagesAvailable = false;

                    } else {
                        // this.packagesAvailable = true;
                    }
                }
            } else {
                this.toastrService.error(doucResp.message);
            }
        })

    }

    packageATApps() {
        const slug = `${environment.cobOld}/api/users/get_features_packages/?module_id=6&usecase_id=2&category=Apps`;
        this.apiService.get(slug).subscribe((appsResp: ApiResponse) => {
            this.responseOFATAppsAPI = appsResp.data;
            // console.log("this.appsRespOFATAppsAPI(after getFeaturesAndPackages())= ", this.responseOFATAppsAPI);

            if (!appsResp.error) {
                // LOOP ON FEATURES[]
                this.responseOFATAppsAPI.features.forEach((elem: any) => {
                    elem.packages.forEach((element: any) => {
                        if (element.is_selected) {
                            element.is_selected = true;
                        } else {
                            element.is_selected = false;
                        }
                    });
                })

                // LOOP ON PACKAGES[]
                // if there are no features against a usecase then dont fill the packages inputs
                if (this.responseOFATAppsAPI.features.length == 0) {
                    //show error swal alert of no packages
                    this.toastrService.error('You cannot select this usecase as there is no feature against this usecase');
                } else {

                    if (this.responseOFATAppsAPI.packages.length == 0) {
                        //show error swal alert of no packages
                        this.toastrService.error('You cannot select this usecase as there is no package against this usecase');
                        // this.packagesAvailable = false;
                    } else {
                        // this.packagesAvailable = true;
                    }
                }

            } else {
                this.toastrService.error(appsResp.message);
            }
        })

    }

    inputboxChanged(feature: any, item: any, event: any) {
        this.newData = []
        // console.log("checkBox is selected (item)= ", item);
        let feature_id = feature.id
        let pacakge_id = item.id
        let data
        data = {
            feature_id: feature_id,
            package_id: pacakge_id
        }
        this.packagefeaturelist.push(data);
        this.newData.push(data)

        if (event.target.checked) {
            for (let i = 0; i < this.fmsData.modules[0]?.features?.length; i++) {
                for (let k = 0; k < this.fmsData.modules[0]?.features[i].packages?.length; k++) {
                    if (this.fmsData.modules[0]?.features[i].id == feature.id && this.fmsData.modules[0]?.features[i].packages[k].id == item.id) {
                        this.fmsData.modules[0].features[i].packages[k].is_selected = true;
                    }
                }
            }
        } else {
            for (let i = 0; i < this.fmsData.modules[0]?.features.length; i++) {
                for (let k = 0; k < this.fmsData.modules[0]?.features[i].packages.length; k++) {
                    if (this.fmsData.modules[0]?.features[i].id == feature.id && this.fmsData.modules[0]?.features[i].packages[k].id == item.id) {
                        this.fmsData.modules[0].features[i].packages[k].is_selected = false;
                    }
                }
            }
        }
    }
}
