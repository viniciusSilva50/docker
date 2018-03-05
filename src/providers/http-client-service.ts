import {Injectable} from '@angular/core';
import {Http, Headers, RequestOptions} from '@angular/http';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';

import {ContextService} from '../providers/context-service';

@Injectable()
export class HttpClientService {

  constructor(private http: Http, private context: ContextService) {
  }

  getHeaders(endpoint) {
    return Observable.create(observer => {
      var httpHeaders = {
        url: null,
        options: null
      };
      this.context.getHttpContext().subscribe((httpContext) => {
        console.log('http-client-service/getHttpContext()', 'httpContext', httpContext);

        if (httpContext && httpContext.serverUrl) {
          httpHeaders.url = httpContext.serverUrl + endpoint;
        } else {
          httpHeaders.url = endpoint;
        }

        if (httpContext.userToken != null) {
          let headers = new Headers({ 'Authorization': 'Bearer ' + httpContext.userToken.access_token });
          httpHeaders.options = new RequestOptions({ headers: headers });
        }

        observer.next(httpHeaders);
        observer.complete();
      });
    });
  }

  get(endpoint)
  {

    return Observable.create(observer => {
      this.getHeaders(endpoint).subscribe((httpHeaders)=>{
        this.http.get(httpHeaders.url, httpHeaders.options)
          .map(res =>
          {
            if(res.text()) 
            { 
              return res.json(); 
            } 
            else 
            { 
              return null; 
            }
          })
          .subscribe(
            data =>
            {
              observer.next(data);
              observer.complete();
            },
            err =>
            {
              observer.error(err);
              observer.complete();
            }
          );
      });
    });
  }

  delete(endpoint)
  {

    return Observable.create(observer => {
      this.getHeaders(endpoint).subscribe((httpHeaders)=>{
        this.http.delete(httpHeaders.url, httpHeaders.options)
          .map(res =>
          {
            if(res.text()) 
            { 
              return res.json(); 
            } 
            else 
            { 
              return null; 
            }
          })
          .subscribe(
            data =>
            {
              observer.next(data);
              observer.complete();
            },
            err =>
            {
              observer.error(err);
              observer.complete();
            }
          );
      });
    });
  }

  post(endpoint, data)
  {
    return Observable.create(observer => {
      this.getHeaders(endpoint).subscribe((httpHeaders)=>{
        this.http.post(httpHeaders.url, data, httpHeaders.options)
          .map(res =>
          {
            if(res.text()) 
            { 
              return res.json(); 
            } 
            else 
            { 
              return null; 
            }
          })
          .subscribe(
            data =>
            {
              observer.next(data);
              observer.complete();
            },
            err =>
            {
              observer.error(err);
              observer.complete();
            }
          );
      });
    });
  }

  put(endpoint, data)
  {
    return Observable.create(observer => {
      this.getHeaders(endpoint).subscribe((httpHeaders)=>{
        this.http.put(httpHeaders.url, data, httpHeaders.options)
          .map(res =>
          {
            if(res.text()) 
            { 
              return res.json(); 
            } 
            else 
            { 
              return null; 
            }
          })
          .subscribe(
            data =>
            {
              observer.next(data);
              observer.complete();
            },
            err =>
            {
              observer.error(err);
              observer.complete();
            }
          );
      });
    });
  }

  postFile(endpoint: string, file: File)
  {
    return Observable.create(observer => {
      this.getHeaders(endpoint).subscribe((httpHeaders)=>{

        let formData: FormData = new FormData();
        let xhr: XMLHttpRequest = new XMLHttpRequest();

        formData.append("File", file, file.name);

          xhr.onreadystatechange = () => {
              if (xhr.readyState === 4) {
                  if (xhr.status === 200) {
                    observer.next(JSON.parse(xhr.response));
                    observer.complete();
                  } else {
                    observer.error(xhr.response);
                    observer.complete();
                  }
              }
          };

          xhr.open('POST', httpHeaders.url, true);
          xhr.send(formData);
      });
    });
  }

}

