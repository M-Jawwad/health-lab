import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from 'src/app/services/api.service';
import { CustomValidators } from 'src/app/utils/custom-validators';
import { environment } from 'src/environments/environment';

@Component({
    selector: 'app-user-form',
    templateUrl: './user-form.component.html',
    styleUrls: ['./user-form.component.scss']
})
export class UserFormComponent implements OnInit {

    data: any;
    selectedImage: any;
    imageToSend!: File;
    submitted: boolean;
    imageLoading: boolean;
    loading: boolean;

    userForm: FormGroup;

    source: any[];
    destination: any[];
    title: string;
    action: string;
    notImage: boolean;
    // uploadImage: boolean;
    userLoggedIn: boolean;

    constructor(
        private modalRef: NgbActiveModal,
        private apiService: ApiService,
        private toastrService: ToastrService,
    ) {
        this.submitted = false;
        this.imageLoading = false;
        this.loading = false;
        this.title = 'Add User';
        this.action = '';
        this.userForm = new FormGroup({
            // id: new FormControl(null),
            first_name: new FormControl(null, [Validators.required, Validators.maxLength(60), CustomValidators.noWhiteSpace]),
            last_name: new FormControl(null, [Validators.required, Validators.maxLength(60), CustomValidators.noWhiteSpace]),
            email: new FormControl(null, [Validators.required, CustomValidators.noWhiteSpace, Validators.pattern("^[a-zA-Z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")]),
            country_code: new FormControl(974),
            phone: new FormControl(null, [Validators.required, Validators.minLength(8), CustomValidators.phoneOnly]),
            designation: new FormControl(null),
            department: new FormControl(null),
            user_picture: new FormControl(null, [Validators.required]),
            status: new FormControl('Active'),
            // group: new FormControl(null, [Validators.required]),
        })
        this.data = null;
        this.source = [];
        this.destination = [];
        this.notImage = false;
        // this.uploadImage = false;
        // this.imageToSend = null;
        this.userLoggedIn = false;
    }

    ngOnInit(): void {
        const us: any = localStorage.getItem('user');
        const user = JSON.parse(us);
        this.userLoggedIn = (!!user && !!this.data && user.id === this.data.id) ? true : false;

        if (!this.data) {
            this.userForm.addControl('is_change_password', new FormControl(false));
            this.getGroups();
        }
        // this.source = [
        //     { id: 1, name: 'Admin', key: 1, selected: false },
        //     { id: 2, name: 'User', key: 2, selected: true },
        //     { id: 3, name: 'Packages', key: 3, selected: false },
        //     { id: 4, name: 'Customer', key: 4, selected: true },
        //     { id: 5, name: 'QR Code', key: 5, selected: false },
        //     { id: 6, name: 'Inventory', key: 6, selected: false },
        // ];

        if (this.data) {
            this.userForm.patchValue(this.data);
            this.selectedImage = this.data.user_picture;
            this.imageToSend = this.data.user_picture;
            if (this.data.phone) {
                let ph = this.data.phone;
                let pho = ph.toString();
                this.userForm.get('phone')?.setValue(pho.replace('974', ''));
            }
            // this.destination = this.data.selected_groups ? this.data.selected_groups : [];
            // this.source = this.data.unselected_groups ? this.data.unselected_groups : [];
            if (this.data.selected_groups && this.data.selected_groups.length > 0) {
                this.data.selected_groups.forEach((element: any) => {
                    this.destination.push(element);
                });
            } else {
                this.destination = [];
            }
            if (this.data.unselected_groups && this.data.unselected_groups.length > 0) {
                this.data.unselected_groups.forEach((element: any) => {
                    this.source.push(element);
                });
            } else {
                this.source = [];
            }
        }
    }

    chooseImage() {
        document.getElementById('fileInput')?.click();
    }

    onImageChanged(event: any) {
        this.imageLoading = true;
        // this.uploadImage = false;
        console.log("event.target.files= ", event.target.files[0])

        if (event.target.files.length > 0) {
            var selectedFile: File;
            selectedFile = event.target.files[0];

            if (selectedFile.type.indexOf('image') === -1) {
                this.notImage = true;
                this.selectedImage = null;
                this.imageLoading = false;
                this.userForm.get('user_picture')?.setValue(null)
            } else {
                this.notImage = false;
                this.imageToSend = event.target.files[0];
                this.userForm.get('user_picture')?.setValue(selectedFile);
                this.readImageURL(event.target);
            }
        }
    }

    readImageURL(input: any) {
        if (input.files && input.files[0]) {
            var reader = new FileReader();
            reader.onload = (e: any) => {
                this.selectedImage = e?.target['result']
            }
            this.imageLoading = false;
            reader.readAsDataURL(input.files[0]);
        }
    }

    onListSignal(ev: any) {
        // this.destination = ev;

        if (ev.type === 'reload') {
            this.destination = [];
            this.source = [];
            if (this.data && this.data.selected_groups.length > 0) {
                this.data.selected_groups.forEach((element: any) => {
                    this.destination.push(element);
                });
            } else {
                this.destination = [];
            }
            if (this.data && this.data.unselected_groups.length > 0) {
                this.data.unselected_groups.forEach((element: any) => {
                    this.source.push(element);
                });
            } else {
                this.destination = [];
            }
            // this.destination = this.data.selected_groups ? this.data.selected_groups : [];
            // this.source = this.data.unselected_groups ? this.data.unselected_groups : [];
        } else {
            this.destination = ev;
        }
    }

    getGroups() {
        const slug = `${environment.userms}/users/get-groups`;
        this.apiService.get(slug).subscribe((resp: any) => {
            this.source = resp.data;
        }, (err: any) => {
            this.toastrService.error(err.error['message'], 'Error', {
                progressBar: true, progressAnimation: 'decreasing', timeOut: 3000
            });
        });
    }

    onSubmit() {
        this.submitted = true;
        if (!this.userForm.valid || this.destination.length === 0 || this.userForm.value['user_picture'] == null) {
            if (this.userForm.value['user_picture'] == null) {
                this.userForm.controls['user_picture'].setErrors({ 'incorrect': true });
            }
            return;
        }

        const slug = `${environment.userms}/users/`;
        const formData = this.userForm.value;

        let payload: any = {
            first_name: formData.first_name,
            last_name: formData.last_name,
            email: formData.email,
            phone: formData.phone,
            status: formData.status,
            department: formData.department,
            designation: formData.designation,
            is_change_password: formData.is_change_password,
            user_picture: formData.user_picture,
            group_list: []
        };

        this.destination.forEach(element => {
            payload.group_list.push(element.id);
        });

        if (this.data && this.data?.id) {
            payload.id = this.data.id;
            let doc = payload.user_picture;
            if (doc == null || (typeof (doc) === 'string' && doc.includes('https'))) {
                delete payload.user_picture;
            }
        }

        let d = this.convertToFormData(payload);

        this.loading = true;
        if (this.data && this.data?.id) {
            // payload.id = this.data.id;
            this.updateUser(slug, d);
        } else {
            this.createUser(slug, d);
        }
    }

    convertToFormData(formData: any) {
        let f = new FormData();
        var form_data = new FormData();
        for (var key in formData) {
            form_data.append(key, formData[key]);
        }
        return form_data;
    }

    createUser(slug: string, payload: any) {
        this.apiService.post(slug, payload).subscribe((resp: any) => {
            this.toastrService.success(resp.message, 'Success', {
                progressBar: true,
                progressAnimation: 'decreasing',
                timeOut: 3000
            });
            this.onCloseModel();
        }, (err: any) => {
            this.toastrService.error(err.error['message'], 'Error creating user', {
                progressBar: true, progressAnimation: 'decreasing', timeOut: 3000
            });
            this.loading = false;
        });
    }

    updateUser(slug: string, payload: any) {
        this.apiService.patch(slug, payload).subscribe((resp: any) => {
            this.toastrService.success(resp.message, 'Success', {
                progressBar: true,
                progressAnimation: 'decreasing',
                timeOut: 3000
            });
            this.onCloseModel();
        }, (err: any) => {
            this.toastrService.error(err.error['message'], 'Error updating user', {
                progressBar: true, progressAnimation: 'decreasing', timeOut: 3000
            });
            this.loading = false;
        });
    }

    onCloseModel() {
        this.modalRef.close();
    }

}
