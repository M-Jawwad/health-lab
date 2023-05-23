import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { ApiResponse } from 'src/app/interfaces/response';
import { ApiService } from 'src/app/services/api.service';
import { VAlertAction } from 'src/app/shared/alert/alert.model';
import { AlertService } from 'src/app/shared/alert/alert.service';
import { CustomValidators } from 'src/app/utils/custom-validators';
import { Helpers } from 'src/app/utils/helpers';
import { environment } from 'src/environments/environment';


@Component({
    selector: 'app-use-case-form',
    templateUrl: './use-case-form.component.html',
    styleUrls: ['./use-case-form.component.scss']
})
export class UsecaseFormComponent implements OnInit {
    title: string;
    loading: boolean;
    doNotUpdate: boolean;

    usecase_name: FormControl;
    usecase_unique_id: FormControl;
    moduleForm: FormGroup;
    packageForm: FormGroup;

    packages: any[];
    selectedPackages: any[];
    modules: any[];
    data: any;

    constructor(
        private modalRef: NgbModal,
        private apiService: ApiService,
        private toastrService: ToastrService,
    ) {
        this.title = 'Add Usecase';
        this.loading = false;
        this.doNotUpdate = false;

        this.usecase_name = new FormControl(null, [Validators.required, Validators.maxLength(60), CustomValidators.noWhiteSpace]);
        this.usecase_unique_id = new FormControl(null);
        // this.module_name = new FormControl(null, [Validators.required]);
        this.packageForm = new FormGroup({
            id: new FormControl(null),
            package_unique_id: new FormControl(null),
            package_name: new FormControl(null, [Validators.required]),
            no_of_users: new FormControl(null, [Validators.required]),
            is_addon: new FormControl(false),
            is_consumer: new FormControl(false)
        });

        this.moduleForm = new FormGroup({
            id: new FormControl(null),
            module_id: new FormControl(null),
            module_name: new FormControl(null, [Validators.required, Validators.maxLength(60), CustomValidators.noWhiteSpace]),
        });

        this.data = null;

        this.packages = [];

        this.selectedPackages = [];
        this.modules = [];
    }

    ngOnInit(): void {
        if (!!this.data) {
            this.usecase_name.setValue(this.data.usecase_name);
            this.usecase_unique_id.setValue(this.data.usecase_unique_id);
            const pkgs = this.data.packages;
            pkgs.forEach((element: any) => {
                element.is_consumer = element.is_consumer_package;
            });
            this.selectedPackages = pkgs;
            if (this.selectedPackages == null) { this.selectedPackages = [] };
            this.modules = this.data.modules;
        }

        this.getPackages();
    }

    getPackages() {
        let slug = `${environment.pkgms}/package-configuration/`;
        this.apiService.get(slug).subscribe((resp: ApiResponse) => {
            this.packages = resp.data['data'];
            // this.packageForm.get('package_name')?.setValue(this.packages[0].name);
            // this.packageForm.get('id')?.setValue(this.packages[0].id);
        }, (err: any) => {
            this.toastrService.error(err.error['message'], 'Error getting packages', {
                progressBar: true, progressAnimation: 'decreasing', timeOut: 3000
            });
        });
    }

    onSelectPackage(ev: any) {
        let id;
        this.packages.forEach(element => {
            if (element.name === ev) {
                return id = element.id;
            }
        });

        this.packageForm.get('id')?.setValue(id);
    }

    onAddPackage(data?: any) {
        const formData = this.packageForm.value;
        const type = formData.id != null ? 'onEdit' : 'onAdd';
        const name = formData.package_name;
        formData.id = type === 'onAdd' ? this.selectedPackages.length + 1 : formData.id;
        
        let allowAdd = false;
        this.selectedPackages.find(ele => {
            return allowAdd = ele.package_name === name;
        });

        if (!!formData) {
            if (!allowAdd) {
                if (type === 'onEdit') {
                    const id = this.selectedPackages.findIndex(rec => rec.package_id === formData.id);
                    if (id != -1) {
                        this.selectedPackages.splice(id, 1, {package_id: formData.id, package_unique_id: formData.package_unique_id, package_name: formData.package_name, no_of_users: formData.no_of_users, is_addon: formData.is_addon, is_consumer: formData.is_consumer });
                    } else {
                        this.selectedPackages.push({package_id: formData.id, package_unique_id: formData.package_unique_id, package_name: formData.package_name, no_of_users: formData.no_of_users, is_addon: formData.is_addon, is_consumer: formData.is_consumer })
                    }
                    // this.selectedPackages = JSON.parse(JSON.stringify(this.selectedPackages));
                } else {
                    this.selectedPackages.push({package_id: formData.id, package_unique_id: formData.package_unique_id, package_name: formData.package_name, no_of_users: formData.no_of_users, is_addon: formData.is_addon, is_consumer: formData.is_consumer });
                }
                this.packageForm.reset();
                this.doNotUpdate = false;
            } else {
                return;
            }
        }
        else { return; }
    }

    onEditPackage(ev: any, idx: number) {
        // this.packageForm.patchValue(ev);
        this.doNotUpdate = true;
        this.packageForm.get('id')?.setValue(ev.package_id);
        this.packageForm.get('package_name')?.setValue(ev.package_name);
        this.packageForm.get('no_of_users')?.setValue(ev.no_of_users);
        this.packageForm.get('package_unique_id')?.setValue(ev.package_unique_id);
        this.packageForm.get('is_addon')?.setValue(ev.is_addon);
        this.packageForm.get('is_consumer')?.setValue(ev.is_consumer);
        this.selectedPackages.splice(idx, 1);
    }

    onChangeStatus(ev: any, idx: number) {
        AlertService.warn('Warning', 'Are You Sure?', 'Yes').subscribe((resp: VAlertAction) => {
            if (resp.positive) {
                // ToDo
            } else {
                return;
            }
        })
    }

    onRemovePackage(idx: number) {
        this.selectedPackages.splice(idx, 1);
    }

    onEditModule(ev: any, idx: number) {
        // console.log(ev);
        this.moduleForm.patchValue(ev);
        this.modules.splice(idx, 1);
    }

    onAddModule() {
        let module = this.moduleForm.value;
        const type = module.module_id ? 'edit' : 'add';
        const name = module.module_name;
        let doAdd = false;

        this.modules.find(ele => {
            return doAdd = ele.module_name === name;
        });

        if (!!module) {
            if (!doAdd) {
                if (type === 'edit') {
                    const id = this.modules.findIndex(element => {
                        return +element.module_id === +module.module_id;
                    });

                    if (id != -1) {
                        this.modules.splice(id, 1, {id: this.modules[id].id, module_id: module.module_id, module_name: module.module_name});
                    } else {
                        this.modules.push({id: module.id, module_id: module.module_id, module_name: module.module_name});    
                    }
                } else {
                    this.modules.push({module_id: module.module_id, module_name: module.module_name});
                }
            } else { return; }
        } else { return; }

        this.moduleForm.reset();
    }

    onRemoveModule(idx: number) {
        let id = this.modules[idx].id;

        const slug = `${environment.pkgms}/usecase-configuration/delete-usecase-module?id=${id}`;
        AlertService.confirm('Are you sure?', 'All features associated with this module will be affected').subscribe((resp: VAlertAction) =>{
            if (resp.positive) {
                this.apiService.delete(slug).subscribe((resp: ApiResponse) => {
                    this.modules.splice(idx, 1);
                    this.toastrService.success(resp.message, 'Module Successfully Deleted', {
                        progressAnimation: 'decreasing', progressBar: true, timeOut: 3000
                    });
                }, (err: any) => {
                    this.toastrService.error(err.error['message'], 'Error deleting module', {
                        progressAnimation: 'decreasing', progressBar: true, timeOut: 3000
                    });
                });
            } else {
                return;
            }
        });
    }
    
    onSubmit() {
        this.loading = true;
        let slug = `${environment.pkgms}/usecase-configuration/`;

        let usecase = this.usecase_name.value;
        let usecase_unique_id = this.usecase_unique_id.value;
        let packs: any[] = [];
        let modules_list: any[] = [];

        this.selectedPackages.forEach(element => {
            packs.push({package_id: element.package_id, package_unique_id: element.package_unique_id, no_of_users: element.no_of_users, is_addon: element.is_addon, is_consumer_package: element.is_consumer });
        });

        this.modules.forEach(element => {
            modules_list.push({module_id: element.id, module_name: element.name});
        })
    
        let payload: any = { usecase_unique_id: usecase_unique_id, usecase_name: usecase, package_list: packs, module_list: this.modules };

        if (!!this.data && this.data?.id) {
            payload.id = this.data.id;
            this.updateUsecase(slug, payload);   
        } else {
            this.createUsecase(slug, payload);
        }
    }

    createUsecase(slug: string, payload: any) {
        this.apiService.post(slug, payload).subscribe((resp: ApiResponse) => {
            this.loading = false;
            this.modalRef.dismissAll();
            this.toastrService.success(resp.message, 'Usecase created successfully', {
                progressBar: true, progressAnimation: 'decreasing', timeOut: 3000
            });
        }, (err: any) => {
            this.loading = false;
            this.toastrService.error(err.error['message'], 'Error creating usecase', {
                progressBar: true, progressAnimation: 'decreasing', timeOut: 3000
            });
        });
    }

    updateUsecase(slug: string, payload: any) {
        this.apiService.patch(slug, payload).subscribe((resp: ApiResponse) => {
            this.loading = false;
            this.modalRef.dismissAll();
            this.toastrService.success(resp.message, 'Usecase updated successfully', {
                progressBar: true, progressAnimation: 'decreasing', timeOut: 3000
            });
        }, (err: any) => {
            this.loading = false;
            this.toastrService.error(err.error['message'], 'Error creating usecase', {
                progressBar: true, progressAnimation: 'decreasing', timeOut: 3000
            });
        });
    }

    integerOnly(ev: any): boolean {
        return Helpers.IntegerOnly(ev);
    }

    onCloseModel() {
        this.modalRef.dismissAll();
    }
}
