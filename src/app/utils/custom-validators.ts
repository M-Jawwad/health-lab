import { AbstractControl } from "@angular/forms";

export class CustomValidators {

    // static noWhiteSpace(control: AbstractControl) {
    //     return (control.value || '').trim();
    //     // return control.value.trim();
    // }

    static noWhiteSpace(control: AbstractControl) {
        const val = control.value;
        let isValid = true;
        if (!!val && (val[0] === ' ' || val[val.length - 1] === ' ')) {
            isValid = false;
        }
        return isValid ? null : { 'whitespace': true };
    }

    static passwordStrength(control: AbstractControl) {
        if (CustomValidators.isEmptyValue(control.value)) {
            return null;
        }
        return control.value
            .match(/^(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.*[a-z])(?=.*[A-Z])[a-zA-Z0-9!@#\$%\^&\*]{8,}$/) ? null : { 'weakPassword': true };
    }

    static passwordMatcher(control: AbstractControl) {
        const password = control.get('password')?.value;
        const confirmPassword = control.get('confirmPassword')?.value;
        if (CustomValidators.isEmptyValue(password) || CustomValidators.isEmptyValue(confirmPassword)) {
            return null;
        }
        return password === confirmPassword ? null : { 'mismatch': true };
    }

    static samePasswords(control: AbstractControl) {
        const password = control.get('password')?.value;
        const oldPassword = control.get('oldPassword')?.value;
        if (CustomValidators.isEmptyValue(password) || CustomValidators.isEmptyValue(oldPassword)) {
            return null;
        }
        return password === oldPassword ? { 'same': true } : null;
    }

    static isEmptyValue(value: any) {
        return value === null || typeof value === 'string' && value.length === 0;
    }

    static isAlphaNumeric(control: AbstractControl) {
        if (!!control.value) {
            return control.value.match(/^[A-Za-z0-9 \s.,-]+$/) ? null : { 'isAlphaNumeric': true };
        } else {
            return null;
        }
    }

    static email(control: AbstractControl) {
        if (!!control.value) {
            return control.value.match(/^[a-zA-Z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$/) ? null : { 'email': true };
        } else {
            return null;
        }
    }

    static phoneOnly(control: AbstractControl) {
        if (!!control.value) {
            return control.value.match(/^[0-9+]+$/) ? null : { 'phoneonly': true };
        } else {
            return null;
        }
    }

    static integerOnly(control: AbstractControl) {
        if (!!control.value) {
            return control.value.match(/^[0-9]+$/) ? null : { 'integeronly': true };
        } else {
            return null;
        }
    }

    static dateOnly(control: AbstractControl) {
        if (!!control.value) {
            return control.value.match(/^(0?[1-9]|[12][0-9]|3[01])[\/\-](0?[1-9]|1[012])[\/\-]\d{4}$/) ? null : { 'dateonly': true };
        } else {
            return null;
        }
    }
}