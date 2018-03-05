import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { FormControl } from '@angular/forms';
 
@Injectable()

export class ApplicationValidationService {

    static getValidatorErrorMessage(validatorName: string, validatorValue?: any) {
        let config = {
            'required': 'Required',
            'invalidCreditCard': 'Is invalid credit card number',
            'invalidEmailAddress': 'Invalid email address',
            'invalidUrl': 'Invalid url',
            'invalidIframe': 'Invalid iframe tag',
            'invalidPassword': 'Invalid password. Password must be at least 6 characters long, and contain a number.',
            'invalideMinValue':'Invalid min value',
            'invalideMaxValue':'Invalid max value',
            'minlength': `Minimum length ${validatorValue.requiredLength}`
        };

        return config[validatorName];
    }

    static creditCardValidator(control) {
        // Visa, MasterCard, American Express, Diners Club, Discover, JCB
        if (control.value.match(/^(?:4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14}|6(?:011|5[0-9][0-9])[0-9]{12}|3[47][0-9]{13}|3(?:0[0-5]|[68][0-9])[0-9]{11}|(?:2131|1800|35\d{3})\d{11})$/)) {
            return null;
        } else {
            return { 'invalidCreditCard': true };
        }
    }

    static emailValidator(control) {
        // RFC 2822 compliant regex
        if (control.value.match(/[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/)) {
            return null;
        } else {
            return { 'invalidEmailAddress': true };
        }
    }

    static urlValidator(control) {
        
        if (control.value == null || control.value === '') return null;

        if (control.value.match(/(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/)) {
            return null;
        } else {
            return { 'invalidUrl': true };
        }
    }

    static iframeValidator(control) {
        
        if (control.value == null) return null;

        var val: string = control.value;

        if (val.startsWith('<iframe') && val.endsWith('</iframe>')) {
            return null;
        } else {
            return { 'invalidIframe': true };
        }
    }
    
    static passwordValidator(control) {
        
        if(control.value == null) return null;
        
        // {6,100}           - Assert password is between 6 and 100 characters
        // (?=.*[0-9])       - Assert a string has at least one number      
        if (control.value.match(/^(?=.*[0-9])[a-zA-Z0-9!@#$%^&*]{6,100}$/)) {
            return null;
        } else {
            return { 'invalidPassword': true };
        }
    }

    static conditional(conditional, validator) {
        
        return function(control) {
            if (control && control._parent) {
                if (conditional(control._parent)) {
                    return validator(control);
                }
            }
        };
    }

    static minValue(control, minValue: number) {
        
        let controlValue: number = control.value;

        console.log("teste validator min value", controlValue);

        if (controlValue >= minValue) {
            return null;
        } else {
            return { 'invalideMinValue': true };
        }
    }

    static maxValue(control, maxValue: number) {
        
        let controlValue: number = control.value;

        console.log("teste validator max value", controlValue);

        if (controlValue <= maxValue) {
            return null;
        } else {
            return { 'invalideMaxValue': true };
        }
    }

    static compareValues(controlNameToCampare: string) {
        
        return (control: FormControl): {[key: string]: boolean} => {

            let passwordReference: string = control.parent.controls[controlNameToCampare].value;
            let val: string = control.value;

            if(val == null) return null;

            if (val == passwordReference) {
                return null;
            } else {
                return { "invalidCompareValues" : true };
            }
        };
    }
}