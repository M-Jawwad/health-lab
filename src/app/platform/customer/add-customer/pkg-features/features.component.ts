import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';

import { ToastrService } from 'ngx-toastr';
import { ApiService } from 'src/app/services/api.service';
import { environment } from 'src/environments/environment';

@Component({
    selector: 'app-features',
    templateUrl: './features.component.html',
    styleUrls: ['./features.component.scss']
})
export class PkgFeaturComponent implements OnInit {
    loading: boolean;
    @Input() readonly: boolean;
    @Input() customerId: number;
    @Output() signals: EventEmitter<any>;

    usecase: FormControl;

    data: any = null;
    usecases: any[];
    features: any[];
    selectedModules: number[];
    unselectedModules: number[];
    selectedUsecase: any;

    constructor(
        private apiService: ApiService,
        private toastrService: ToastrService,
    ) {
        this.loading = false;
        this.readonly = false;
        this.customerId = 0;

        this.selectedModules = [];
        this.unselectedModules = [];
        this.usecases = [
            { id: 1, title: 'Asset Tracking', is_addon: false },
            { id: 2, title: 'Fleet Management System', is_addon: false },
            { id: 3, title: 'FMS New Pkg', is_addon: true },
        ];

        this.features = [
            // { id: 'F-1', name: 'Real Time Tracking', status: 'Default' },
            // { id: 'F-2', name: 'Playbacl', status: 'Default' },
            // { id: 'F-3', name: 'Manage Geozones', status: 'Default' },
            // { id: 'F-4', name: 'Manage Fleet', status: 'Default' },
            // { id: 'F-5', name: 'Violations', status: 'Default' },
            // { id: 'F-6', name: 'Driver', status: 'is_addon' },
            // { id: '', name: 'Manage Driver', status: '' },
            // { id: '', name: 'Manage Shift', status: '' },
            // { id: '', name: 'Manage Job', status: '' },
            // { id: '', name: 'Driver to vehicle allocation', status: '' },
            // { id: '', name: 'Driver to shift allocation', status: '' },
        ];

        this.usecase = new FormControl('');
        this.signals = new EventEmitter();
    }

    ngOnInit(): void {
        this.getUsecases();
    }

    getUsecases() {
        this.loading = true;
        const slug = `${environment.customerms}/customers/get-selected-usecases-packages?customer=${this.customerId}`;
        this.apiService.get(slug).subscribe((resp: any) => {
            this.loading = false;
            this.usecases = resp.data['data'];
        }, (err: any) => {
            this.loading = false;
            this.toastrService.error(err.error['message']);
        });
    }

    onSelectUsecase(ev: any) {
        this.usecases.forEach(ele => {
            if (ele.usecase_id === ev) {
                this.selectedUsecase = ele;
            }
        });

        if (!this.selectedUsecase.is_addon) {
            this.signals.emit({type: 'addon', data: true});
        }
        // console.log(this.selectedUsecase);
        this.getFeatures(ev);
    }

    getFeatures(id: number) {
        this.loading = true;
        const slug = `${environment.pkgms}/usecase-configuration/get-usecase-modules?usecase_id=${id}&customer_id=${this.customerId}`;
        this.apiService.get(slug).subscribe((resp: any) => {
            const dt = resp.data['module_list'];
            dt.forEach((element: any) => {
                element.view_id = element.module_id;
                element.feature_list.forEach((ele: any) => {
                    ele.module_id = element.module_id
                });
            });

            dt.forEach((element: any) => {
                element.feature_list.forEach((ele: any) => {
                    if (element.module_id === ele.module_id) {
                        dt.push({id: ele.id, f_id: ele.customer_feature_id, module_name: ele.feature_name, module_id: ele.module_id, view_id: '', is_addon: ele.is_addon, default: ele.default});
                    }
                });
            });

            this.loading = false;
            // this.features = dt;
            this.features = dt.sort((a: any, b: any) => a.module_id - b.module_id );
            this.features.forEach(ele => {
                if (ele?.default && ele.view_id === '') {
                    ele.is_addon = true;
                }
                if (ele.is_addon && ele.view_id === '') {
                    this.onSelectAddon(ele);
                }
            });
        }, (err: any) => {
            this.loading = false;
            this.toastrService.error(err.error['message']);
        });
    }

    onMasterToggle(ev: any) {
        this.selectedModules = [];
        this.unselectedModules = [];

        this.features.forEach(ele => {
            if (ev.module_id === ele.module_id) {
                if (ev.is_addon) {
                    ele.is_addon = true;
                    // if (!ele.default) {
                    // }
                } else {
                    ele.is_addon = false;
                    // if (!ele.default) {
                    // }
                }
            }
        });

        this.features.forEach(ele => {
            if (ele.is_addon && ele.view_id === '') {
                this.selectedModules.push(ele.f_id);
                // if (!ele.default) {
                // }

                let idx = this.unselectedModules.findIndex(id => {
                    return id == ele.f_id;
                });
                if (idx !== -1) {
                    this.unselectedModules.splice(idx, 1);
                }

            } else {
                if (ele.view_id === '' && !ele.default) {
                    this.unselectedModules.push(ele.f_id);
                }

                let idx = this.selectedModules.findIndex(id => {
                    return id == ele.f_id;
                });
                if (idx !== -1) {
                    this.selectedModules.splice(idx, 1);
                }
            }
        });

        // console.log(this.features, this.selectedModules, this.unselectedModules);
    }

    onSelectAddon(ev: any) {
        // console.log(ev);
        // this.selectedModules = [];
        this.unselectedModules = [];

        if (ev.is_addon) {
            this.selectedModules.push(ev.f_id);
        } else {
            let idx = this.selectedModules.findIndex(id => {
                return id == ev.f_id;
            });
            this.selectedModules.splice(idx, 1);
        }

        this.features.forEach(ele => {
            if (!ele.is_addon && ele.view_id === '') {
                this.unselectedModules.push(ele.f_id);
                // if (!ele.default) {
                // }
            }
        });

        const feature = this.features.filter(item => {
            return item.module_id == ev.module_id
        });

        let moduleArray: any[] = [];

        feature.forEach(element => {
            if (element?.f_id) {
                let obj = this.selectedModules.find(x => x === element?.f_id);
                if (obj) {
                    moduleArray.push(obj);
                }
            }
        });

        if (moduleArray && moduleArray?.length === 0) {
            let parent = this.features.find(x => x.id === feature[0]?.id);
            let i = 0
            this.features.forEach(item => {
                if (item.module_id == parent.module_id) {
                    if (i === 0) {
                        item.is_addon = false;
                    }
                    i++
                }
            })
        }

        if (moduleArray && moduleArray?.length > 0) {
            let parent = this.features.find(x => x.id === feature[0]?.id);
            let i = 0
            this.features.forEach(item => {
                if (item.module_id == parent.module_id) {
                    if (i === 0) {
                        item.is_addon = true;
                    }
                    i++
                }
            })
        }

        // console.log(this.features, this.selectedModules, this.unselectedModules);
    }

    onSubmit() {
        this.loading = true;
        const slug = `${environment.pkgms}/usecase-configuration/get-usecase-modules`;
        let payload: any = { customer_id: this.customerId, selected_feature_list: this.selectedModules, unselected_feature_list: this.unselectedModules, usecase_unique_id: this.selectedUsecase.usecase_unique_id };

        this.apiService.patch(slug, payload).subscribe((resp: any) => {
            this.loading = false;
            this.toastrService.success(resp.message, 'Add-on assigned succefully');
            this.signals.emit({ loading: false });
        }, (err: any) => {
            this.loading = false;
            this.toastrService.error(err.error['message'], 'Error updating feature add-on');
        });
    }

    getStatus(ev: any) {
        return ev.is_addon || ev.default ? true : false;
    }
}