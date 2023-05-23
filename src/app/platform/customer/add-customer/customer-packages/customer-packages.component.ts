import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { ApiResponse } from 'src/app/interfaces/response';
import { ApiService } from 'src/app/services/api.service';
import { VAlertAction } from 'src/app/shared/alert/alert.model';
import { AlertService } from 'src/app/shared/alert/alert.service';
import { environment } from 'src/environments/environment';

import { AdminFormComponent } from '../admin-form/admin-form.component';

@Component({
    selector: 'app-customer-packages',
    templateUrl: './customer-packages.component.html',
    styleUrls: ['./customer-packages.component.scss']
})
export class CustomerPackagesComponent implements OnInit {
    loading: boolean;
    @Input() readonly: boolean;
    @Input() showPackages: boolean;
    @Input() showAdminList: boolean;
    @Input() customerId: number;
    @Output() signals: EventEmitter<any>;
    data: any;
    currentCustomerId: any;

    packages: any[];
    customerPackages: any[];
    selectedPackages: any[];

    usecases: any[];
    customerUsecases: any[];
    selectedUsecases: any[];

    vodafonr_contact_person: FormControl;
    adminContactPersons: string;          //var to save multiple contact persons to show under VODAFONE CONTACT PERSON input
    disableContactPersonInput: boolean;   //disable VODAFONE CONTACT PERSON input if user has added 3 contact person (cant add more than 3 contact persons) 
    submitted: boolean;
    usecasesPackagesLengthEqual: boolean;

    constructor(
        private activatedRoute: ActivatedRoute,
        private modal: NgbModal,
        private apiService: ApiService,
        private toastrService: ToastrService,
    ) {
        this.loading = false;
        this.readonly = false;
        this.showPackages = true;
        this.showAdminList = false;
        this.customerId = 0;
        this.usecasesPackagesLengthEqual = false;

        this.signals = new EventEmitter();
        const emailPattern = "^([a-zA-Z0-9._%+-]+@[a-z0-9.-]+\\.+[a-z]{2,3}(,)*)+$";
        this.vodafonr_contact_person = new FormControl(null, [Validators.required, Validators.pattern(emailPattern)]);

        this.packages = [];
        this.selectedPackages = [];
        this.customerPackages = [];

        this.usecases = [];
        this.selectedUsecases = [];
        this.customerUsecases = []

        this.data = null;
        this.adminContactPersons = "";
        this.disableContactPersonInput = false
        this.submitted = false;
    }

    ngOnInit(): void {
        this.activatedRoute.params.subscribe((params: any) => {
            // use this.currentCustomerId to check if this is ADD or EDIT 
            this.currentCustomerId = isNaN(Number(params['id'])) ? null : Number(params['id']);
        });
        // console.log("this.currentCustomerId== ", this.currentCustomerId)

        if (this.showPackages) {
            this.getPackages();
            this.getCustomerPackages();
        }

        if (this.showAdminList) {
            this.getCustomerUsecase();
            this.getAdminList();
        }

        // this.vodafonr_contact_person.valueChanges.pipe(debounceTime(400), distinctUntilChanged()).subscribe(value => {
        //     // console.log(value);
        //     this.validateEmail(value);
        // });
    }

    // Customer Packages Section
    getPackages() {
        this.signals.emit({ loading: true });
        let slug = `${environment.customerms}/customers/get-packages`;
        this.apiService.get(slug).subscribe((resp: ApiResponse) => {
            this.packages = resp.data['data'];
            this.signals.emit({ loading: false });
        }, (err: any) => {
            this.signals.emit({ loading: false });
            this.toastrService.error(err.error['message'], 'Error getting packages', {
                progressAnimation: 'decreasing', progressBar: true, timeOut: 3000
            });
        });
    }

    getCustomerPackages() {
        this.signals.emit({ loading: true });
        this.loading = true;
        let slug = `${environment.customerms}/customers/customer-package?customer=${this.customerId}`;
        this.apiService.get(slug).subscribe((resp: ApiResponse) => {
            this.customerPackages = resp.data['data'];
            let cp = resp.data['data'];

            cp.forEach((element: any) => {
                let idx = element.packages.findIndex((ele: any) => {
                    return ele.is_selected;
                });

                if (idx != -1) {
                    this.onSelectPackage(element.packages, idx);
                } else {
                    return;
                }
            });

            this.loading = false;
            this.signals.emit({ loading: false });
        }, (err: any) => {
            this.loading = false;
            this.signals.emit({ loading: false });
            this.toastrService.error(err.error['message'], 'Error getting packages', {
                progressAnimation: 'decreasing', progressBar: true, timeOut: 3000
            });
        })
    }

    getSortedPackages(data: any[]) {
        let st = data.sort((a, b) => (a.package_id > b.package_id ? 1 : -1));
        return st;
    }

    onSelectPackage(packs: any[], idx: number, ev?: any) {
        for (let i = 0; i < packs.length; i++) {
            packs[i].is_selected = false;
            // packs[idx].is_selected = true;
            if (!packs[idx].is_selected) {
                packs[idx].is_selected = true;
            }
        }

        this.selectedPackages = [];
        this.customerPackages.forEach(element => {
            element.packages.forEach((pkg: any) => {
                this.selectedPackages.push({ usecase: element.usecase_proxy_id, package: pkg.package_proxy_id, is_selected: pkg.is_selected });
            });
        });
    }

    onSubmit() {
        this.signals.emit({ loading: true });
        let slug = `${environment.customerms}/customers/customer-package`;
        let payload: any = { customer: this.customerId, customer_usecase_packages: this.selectedPackages };
        // console.log("payload== ", payload)
        this.apiService.patch(slug, payload).subscribe((resp: ApiResponse) => {
            this.signals.emit({ loading: false, activeId: 'al' });
            this.toastrService.success(resp.message, 'Packages updated successfully', {
                progressBar: true, progressAnimation: 'decreasing', timeOut: 3000
            });
            this.getCustomerPackages();
        }, (err: any) => {
            this.signals.emit({ loading: false });
            this.toastrService.error(err.error['message'], 'Error updating packages', {
                progressBar: true, progressAnimation: 'decreasing', timeOut: 3000
            });
        });
    }

    // Customer admin section
    getAdminList() {
        this.signals.emit({ loading: true });
        this.loading = true;
        const slug = `${environment.customerms}/customers/customer-admin-list?customer=${this.customerId}`;
        this.apiService.get(slug).subscribe((resp: ApiResponse) => {
            this.loading = false;
            this.signals.emit({ loading: false });
            this.customerUsecases = resp.data['data'];
            // console.log("this.customerUsecases++++++++++++++> ", this.customerUsecases)
            // this.onSelectUsecase();
            if (this.customerUsecases.length > 0) {
                this.adminContactPersons = this.customerUsecases[0]?.contact_persons
                if (this.adminContactPersons != '') {
                    var arr = this.adminContactPersons.split(",")
                    if (arr.length >= 0) {
                        this.disableContactPersonInput = true;
                        this.vodafonr_contact_person.setValue(this.adminContactPersons);
                    }
                }

                // Adding extra boolean key 'is_disabled' to disable only those inboxes (usecases) 
                // which has 'is_selected' == true 
                for (let k = 0; k < this.customerUsecases?.length; k++) {
                    for (let x = 0; x < this.customerUsecases[k]?.usecases?.length; x++) {
                        if (this.customerUsecases[k]?.usecases[x].is_selected) {
                            this.customerUsecases[k].usecases[x]['is_disabled'] = true
                        } else {
                            this.customerUsecases[k].usecases[x]['is_disabled'] = false
                        }
                        // Hide 'Add New Admin' button if usecases's length and packages in usecase length are equal
                        this.usecasesPackagesLengthEqual = this.customerUsecases?.length == this.customerUsecases[k].usecases.length ? true : false
                    }
                }
            }
        }, (err: any) => {
            this.loading = false;
            this.signals.emit({ loading: false });
            this.toastrService.error(err.error['message'], 'Error getting admin list', {
                progressBar: true, progressAnimation: 'decreasing', timeOut: 3000
            });
        });
    }

    getCustomerUsecase() {
        const slug = `${environment.customerms}/customers/get-customer-usecase?customer=${this.customerId}&admin_list=true`;
        this.apiService.get(slug).subscribe((resp: ApiResponse) => {
            this.usecases = resp.data['data'];

        }, (err: any) => {
            this.toastrService.error(err.error['message'], 'Error getting usecases', {
                progressBar: true, progressAnimation: 'decreasing', timeOut: 3000
            });
        });
    }

    onSelectUsecase() {
        this.selectedUsecases = [];
        this.customerUsecases.forEach(element => {
            element.usecases.forEach((usecase: any) => {
                if (usecase.is_selected) {
                    this.selectedUsecases.push({ usecase: usecase.usecase_mapping_id, admin_id: element.id, is_selected: usecase.is_selected });
                }
            });
        });
        this.submitted = false
    }

    onUpdateAdminList() {
        this.signals.emit({ loading: true });
        const slug = `${environment.customerms}/customers/customer-admin-list`;
        var contact_person: string;
        this.submitted = true;
        // if (this.adminContactPersons != '') {
        // contact_person = this.vodafonr_contact_person.value + "," + this.adminContactPersons
        // } else {
        contact_person = this.vodafonr_contact_person.value
        // }

        let payload = { customer: this.customerId, admin_usecases: this.selectedUsecases, contact_person: contact_person };

        this.apiService.patch(slug, payload).subscribe((resp: ApiResponse) => {
            this.signals.emit({ loading: false });
            this.toastrService.success(resp.message, 'Admin list Successfully Updated', {
                progressAnimation: 'decreasing', progressBar: true, timeOut: 3000
            });
            this.vodafonr_contact_person.reset();
            this.getAdminList();
            this.submitted = true;
        }, (err: any) => {
            this.signals.emit({ loading: false });
            this.toastrService.error(err.error['message'], 'Error updating admin list', {
                progressBar: true, progressAnimation: 'decreasing', timeOut: 3000
            });
        });
    }

    onAddAdmin(ev?: any, type?: string) {
        const modalRef = this.modal.open(AdminFormComponent, { size: 'md', scrollable: true });

        modalRef.componentInstance.customerId = this.customerId;
        if (!!ev) {
            modalRef.componentInstance.data = ev;
            modalRef.componentInstance.title = 'Edit Admin';
            modalRef.componentInstance.readonly = false;
        }

        if (type === 'detail') {
            modalRef.componentInstance.title = 'Admin Details';
            modalRef.componentInstance.readonly = true;
        }

        modalRef.closed.subscribe(() => {
            this.getAdminList();
        });
    }

    removeAdmin(idx: number) {
        // this.selectedUsecases.splice(idx, 1);
        const slug = `${environment.customerms}/customers/customer-admin?customer=${this.customerId}`;
        AlertService.warn('Are you sure?', 'You want to delete this admin', 'Yes').subscribe((resp: VAlertAction) => {
            if (resp.positive) {
                this.signals.emit({ loading: true });
                this.apiService.delete(slug).subscribe((resp: ApiResponse) => {
                    this.toastrService.success(resp.message, 'Admin successfully deleted', {
                        progressBar: true, progressAnimation: 'decreasing', timeOut: 3000
                    });
                    this.signals.emit({ loading: false });
                    this.getAdminList();
                }, (err: any) => {
                    this.signals.emit({ loading: false });
                    this.toastrService.error(err.error['message'], 'Error deleting admin', {
                        progressBar: true, progressAnimation: 'decreasing', timeOut: 3000
                    });
                });
            } else {
                return;
            }
        })
    }

    onCloseModel() {
        // this.modalRef.close();
    }

    resetAdminList() {
        this.vodafonr_contact_person.reset();
        this.getCustomerUsecase();
        this.getAdminList();
    }

    // validateEmail(control: any) {
    //     const val = control?.split(',');
    //     console.log(val);
    //     let regex1 = "^[a-zA-Z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$";
    //     let regex = "^([a-zA-Z0-9._%+-]+@[a-z0-9.-]+\\.+[a-z]{2,3}(, )*)+$";

    //     if (val && val.length > 0) {
    //         val.forEach((element: string) => {
    //             element = element.trim();
    //             console.log(element);
    //             // if (element) {
    //             //     this.vodafonr_contact_person.setValidators([Validators.pattern(regex)]);
    //             // }
    //             if (element.match(regex)) {
    //                return this.vodafonr_contact_person.setErrors({'pattern': true});
    //             } else {
    //                 return this.vodafonr_contact_person.setErrors({'pattern': false});
    //             }
    //         });
    //     }
    // }
}
