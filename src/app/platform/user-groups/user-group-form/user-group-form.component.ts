import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { VAlertAction } from 'src/app/shared/alert/alert.model';
import { AlertService } from 'src/app/shared/alert/alert.service';
import { ApiService } from 'src/app/services/api.service';
import { environment } from 'src/environments/environment';
import { CustomValidators } from 'src/app/utils/custom-validators';

@Component({
    selector: 'app-user-group-form',
    templateUrl: './user-group-form.component.html',
    styleUrls: ['./user-group-form.component.scss']
})
export class UserGroupFormComponent implements OnInit {
    @Input() group_id: number;
    data: any;
    action: string;
    groups: any;
    errorMessage: boolean;
    submitted: boolean;
    loading: boolean;
    groupFound: boolean = false;
    users: any[];
    selectedGroups: any[] = [];

    userGroupForm: FormGroup;

    constructor(
        private modalRef: NgbActiveModal,
        private apiService: ApiService,
        private toastrService: ToastrService
    ) {
        this.data = null;
        this.errorMessage = false;
        this.users = [];
        this.group_id = 0;
        this.action = 'Add Group';
        this.submitted = false;
        this.loading = false;
        this.userGroupForm = new FormGroup({
            name: new FormControl(null, [Validators.required, Validators.maxLength(60), CustomValidators.noWhiteSpace]),
            description: new FormControl(null, [Validators.required, CustomValidators.noWhiteSpace]),
            status: new FormControl('Active'),
            users: new FormControl('Active, InActive'),
        });

        this.groups = [];
    }

    ngOnInit(): void {
        if (this.data) {
            this.userGroupForm.patchValue(this.data);
            this.groups = this.data["features"];
            this.users = this.data.users;
        } else {
            this.getGroupFeatures();
        }

        this.checkGroup();
    }

    checkGroup() {
        const us: any = localStorage.getItem('user');
        const user = JSON.parse(us);
        this.selectedGroups = user.selected_groups;

        this.selectedGroups?.forEach(ele => {
            if (ele?.name === this.data?.name) {
                this.groupFound = true;
            } else {
                this.groupFound = false;
            }
        });
    }

    getGroupDetails() {
        const slug = `${environment.userms}/group/?id=${this.data.id}`;

        this.apiService.get(slug).subscribe((resp: any) => {
            this.userGroupForm.patchValue(resp.data['data'][0]);
            this.groups = resp.data['data'][0].features;
            this.users = resp.data['data'][0].users;
        }, (err: any) => {
            this.toastrService.error(err.error['message'], 'Error', {
                progressAnimation: 'decreasing', progressBar: true, timeOut: 3000
            });
        });
    }

    getGroupFeatures() {
        this.loading = true;
        const slug = `${environment.userms}/group/feature`;
        this.apiService.get(slug).subscribe((resp: any) => {
            this.loading = false;
            this.groups = resp.data.data
        }, (err: any) => {
            this.loading = false;
            this.toastrService.error(err.error['message'], 'Error', {
                progressAnimation: 'decreasing', progressBar: true, timeOut: 3000
            });
        });
    }

    onSubmit() {
        this.submitted = true;
        this.loading = true;
        if (!this.userGroupForm.valid) {
            return;
        }

        let slug = `${environment.userms}/group/`;
        const formData = this.userGroupForm.value;

        let payload: any = { name: formData.name, description: formData.description, feature_list: [] };

        this.groups.forEach((element: any) => {
            if (!element.permission || element.permission === '') { return; }
            payload.feature_list.push({ id: element.id, permission: element.permission, parent_id: element.parent_id });
        });

        if (payload.feature_list.length === 0) {
            this.errorMessage = true;
            this.loading = false;
            return;
        }
        else {
            this.errorMessage = false;
        }

        if (this.data && this.data.id) {
            payload.id = this.data.id;
            payload.status = formData.status;
            // slug = `group/${this.data.id}`;
            this.updateGroup(slug, payload);
        }
        else {
            this.createGroup(slug, payload);
        }
    }

    createGroup(slug: string, payload: any) {
        this.apiService.post(slug, payload).subscribe((resp: any) => {
            this.toastrService.success(resp.message, 'Success', {
                progressBar: true, progressAnimation: 'decreasing', timeOut: 3000
            });
            this.loading = false;
            this.getMenu();
            this.onCloseModal();
        }, (err: any) => {
            this.toastrService.error(err.error['message'], 'Error creating group', {
                progressBar: true, progressAnimation: 'decreasing', timeOut: 3000
            });
            this.loading = false;
        });
    }

    updateGroup(slug: string, payload: any) {
        if (payload.status === 'InActive') {
            AlertService.warn('Warning', 'Associated Users with this group will be effected').subscribe((resp: VAlertAction) => {
                if (resp.positive) {
                    this.loading = true;
                    this.apiService.patch(slug, payload).subscribe((resp: any) => {
                        this.toastrService.success(resp.message, 'Success', {
                            progressBar: true, progressAnimation: 'decreasing', timeOut: 3000
                        });
                        this.loading = true;
                        this.getMenu();
                        this.onCloseModal();
                    }, (err: any) => {
                        this.toastrService.error(err.error['message'], 'Error updating group', {
                            progressBar: true, progressAnimation: 'decreasing', timeOut: 3000
                        });
                        this.loading = false;
                    });
                } else {
                    return;
                }
            });
        } else {
            this.loading = true;
            this.apiService.patch(slug, payload).subscribe((resp: any) => {
                this.toastrService.success(resp.message, 'Success', {
                    progressBar: true, progressAnimation: 'decreasing', timeOut: 3000
                });
                this.loading = true;
                this.getMenu();
                this.onCloseModal();
            }, (err: any) => {
                this.toastrService.error(err.error['message'], 'Error updating group', {
                    progressBar: true, progressAnimation: 'decreasing', timeOut: 3000
                });
                this.loading = false;
            });
        }
    }

    getMenu() {
        localStorage.removeItem('menu');
        this.loading = true;
        const slug = `${environment.userms}/users/menu-preferences`;

        return this.apiService.get(slug).subscribe((resp: any) => {
            this.loading = false;
            let menu = resp.data;
            localStorage.setItem('menu', JSON.stringify(menu));
        }, (err: any) => {
            this.loading = true;
            this.toastrService.error(err.error['message'], 'Error',
                { progressAnimation: 'decreasing', progressBar: true, timeOut: 3000 });
        });
    }

    onCloseModal() {
        this.modalRef.close();
    }

    onClear(idx: number, group: any) {
        this.groups.forEach((element: any) => {
            if (element.id === group.id) {
                if (element.parent_id === group.parent_id) {
                    element.permission = '';
                }
            }

            if (element.id === group.parent_id) {
                element.permission = '';
            }
        });
    }

}
