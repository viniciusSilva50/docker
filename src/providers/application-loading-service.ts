import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Subject } from 'rxjs/Subject';

@Injectable()

export class ApplicationLoadingService {

    private subject = new Subject<boolean>();
    
    showLoading() {
        this.subject.next(true);
    }

    hideLoading()
    {
        this.subject.next(false);
    }
 
    getLoading(): Observable<boolean> {
        return this.subject.asObservable();
    }
}