import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { ChangePasswordComponent } from 'src/app/core/login/change-password/change-password.component';
import { ApiService } from 'src/app/services/api.service';
import { CustomValidators } from 'src/app/utils/custom-validators';
import { environment } from 'src/environments/environment';


@Component({
    selector: 'app-user-profile',
    templateUrl: './user-profile.component.html',
    styleUrls: ['./user-profile.component.scss']
})
export class UserProfileFormComponent implements OnInit {

    selectedImage: any;
    submitted: boolean;
    isSuperAdmin: boolean;
    imageLoading: boolean;

    userProfileForm: FormGroup;
    userSubscription$ = new Subscription;
    userProfileData: any;

    constructor(
        // private modalRef: NgbActiveModal,
        private location: Location,
        private modal: NgbModal,
        private apiService: ApiService,
        private toastrService: ToastrService,
    ) {
        this.submitted = false;
        this.isSuperAdmin = false;
        this.imageLoading = false;
        this.userProfileForm = new FormGroup({
            id: new FormControl(null),
            first_name: new FormControl(null, [Validators.required, Validators.maxLength(60), CustomValidators.noWhiteSpace]),
            last_name: new FormControl(null, [Validators.required, Validators.maxLength(60), CustomValidators.noWhiteSpace]),
            email: new FormControl(null, [Validators.required, Validators.pattern("^[a-zA-Z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")]),
            phone: new FormControl(null, [Validators.required, Validators.minLength(8), CustomValidators.noWhiteSpace, CustomValidators.phoneOnly]),
            designation: new FormControl(null),
            department: new FormControl(null),
            user_picture: new FormControl(null),
            status: new FormControl('Active'),
            group: new FormControl(null),
        });
        this.userProfileData = null;
    }

    ngOnInit(): void {
        this.getUser();
        // let usr: any = localStorage.getItem('user');
        // let user: any = JSON.parse(usr);
        // this.userProfileForm.patchValue(user);

        // this.isSuperAdmin = user['type'] === 'SA' ? true : false;
        // this.selectedImage = user['user_picture'];

        // watch for changes in localStorage, change header properties accordingly for user
        this.userSubscription$ = localStorage?.changes?.subscribe((res: any) => {
            setTimeout(() => {
                this.getUser();
            }, 1000);
            if (this.userSubscription$) {
                this.userSubscription$.unsubscribe();
            }
        });
    }

    getUser() {
        const slug = `${environment.userms}/users/get-current-user`;
        this.apiService.get(slug).subscribe((resp: any) => {
            const data = resp.data['data'];
            this.userProfileData = resp.data['data']
            // let ph = data.phone;
            // let pho = ph.toString();
            // this.userProfileForm.get('phone')?.setValue(pho.replace('974', ''));
            this.userProfileForm.patchValue(data);
            // set the value of GROUP control of userProfile form individually as key coming from backend 
            // is 'selected_groups' and can't be mapped by patchValue()
            this.userProfileForm.controls['group'].setValue(data.selected_groups)

            this.isSuperAdmin = data['type'] === 'SA' ? true : false;
            this.selectedImage = data['user_picture'];
        })
    }

    chooseImage() {
        document.getElementById('fileInput')?.click();
    }

    onImageChanged(event: any) {
        this.imageLoading = true;
        var selectedFile: File;
        selectedFile = event.target.files[0];
        this.userProfileForm.get('user_picture')?.setValue(selectedFile);
        // console.log('image -== ', selectedFile);
        this.readImageURL(event.target);
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

    onSubmit() {
        this.submitted = true;
        if (!this.userProfileForm.valid) {
            return;
        }

        const slug = `${environment.userms}/users/`;
        const data = this.userProfileForm.value;

        let payload: any = {
            id: data.id,
            first_name: data.first_name,
            last_name: data.last_name,
            email: data.email,
            phone: data.phone,
            user_picture: data.user_picture,
            status: data.status,
            department: data.department,
            designation: data.designation,
            is_change_password: data.is_change_password,
            group_list: []   //initialize the group_list as array otherwise it will give error while pushing group ID
        };

        if (data?.group != null) {
            data?.group.forEach((element: any) => {
                payload['group_list'].push(element.id);
            });
        } else {
            payload['group_list'] = null
        }

        // Delete user_profile key if user didn't change the image and image is going as string
        // string will give error as backend is expecting a file format for picture
        let doc = payload.user_picture;
        if (doc == null || (typeof (doc) === 'string' && doc.includes('https'))) {
            delete payload.user_picture;
        }

        let d = this.convertToFormData(payload);
        this.updateUser(slug, d);
    }

    convertToFormData(formData: any) {
        let form_data = new FormData();
        for (var key in formData) {
            form_data.append(key, formData[key]);
        }
        return form_data;
    }

    updateUser(slug: string, payload: any) {
        this.apiService.patch(slug, payload).subscribe((resp: any) => {
            this.toastrService.success(resp.message, 'Success', {
                progressBar: true,
                progressAnimation: 'decreasing',
                timeOut: 3000
            });
            this.getUser();
            // this.onCloseModel();

            // Sets updated data of 'user' in localstorage
            var u: any = localStorage.getItem('user');
            u = JSON.parse(u)
            u['department'] = this.userProfileData['department'];
            u['designation'] = this.userProfileData['designation'];
            u['email'] = this.userProfileData['email'];
            u['name'] = this.userProfileData['name'];
            u['user_picture'] = this.userProfileData['user_picture'];
            u['first_name'] = this.userProfileData['first_name'];
            u['last_name'] = this.userProfileData['last_name'];
            u['phone'] = this.userProfileData['phone'];
            localStorage.setItem('user', JSON.stringify(u));

        }, (err: any) => {
            this.toastrService.error(err.error['message'], 'Error');
        });
    }

    openResetModal() {
        const modalRef = this.modal.open(ChangePasswordComponent, { size: 'md', scrollable: true });

        modalRef.componentInstance.fromProfile = true;
        modalRef.componentInstance.email = this.userProfileForm.get('email')?.value;
        // this.modalRef.close();
    }

    onBack() {
        // this.router.navigateByUrl('admin');
        this.location.back();
    }

}
