import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Subject } from 'rxjs/Subject';

import {Message} from 'primeng/primeng';
 
@Injectable()

export class ApplicationMessageService {

    private subject = new Subject<Message>();

    private showMessage(fullMessage: Message) {
        this.subject.next(fullMessage);
    }

    showInfoMessage(title: string, body: string){
        let fullMessage : Message = {
            severity: 'info',
            summary: title,
            detail: body
        };

        this.showMessage(fullMessage);
    }

    showWarnMessage(title: string, body: string){
        let fullMessage : Message = {
            severity: 'warn',
            summary: title,
            detail: body
        };

        this.showMessage(fullMessage);
    }

    showErrorMessage(title: string, body: string){
        let fullMessage : Message = {
            severity: 'error',
            summary: title,
            detail: body
        };

        this.showMessage(fullMessage);
    }

    showSuccessMessage(title: string, body: string){
        let fullMessage : Message = {
            severity: 'success',
            summary: title,
            detail: body
        };

        this.showMessage(fullMessage);
    }
 
    getMessage(): Observable<Message> {
        return this.subject.asObservable();
    }
}