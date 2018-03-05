import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder,  FormGroup, Validators } from '@angular/forms';
import { MenuItem, SelectItem } from 'primeng/primeng';

// Models
import { IAmazonUploadResponse, ILocalFileUploadResponse } from '../../../models/fileupload-model';
import { IBannerCreateRequest } from '../../../models/banner-model';

// Providers
import { ApplicationMessageService } from '../../../providers/application-message-service';
import { ApplicationLoadingService } from '../../../providers/application-loading-service';
import { ApplicationValidationService } from '../../../providers/application-validation-service';
import { BannerService } from '../../../providers/banner-service';
import { FileUploadService } from '../../../providers/fileupload-service';

@Component({
  selector: 'app-create-banner',
  templateUrl: './create-banner.component.html',
  styleUrls: ['./create-banner.component.css'],
  providers:[ BannerService, FileUploadService ]
})
export class CreateBannerComponent implements OnInit {

  // Page attributes
  bannerTypes: SelectItem[] = [];
  bannerHeight: number = 0;
  bannerWidht: number = 0;
  timeNow: Date = null;
  minEndDate: Date = null;
  isScheduleValid: boolean = true;
  bannerMaskContainerStyle: any = null;

  // Advertiver params
  newBannerForm: FormGroup = null;
  bannerFileParams: {currentFile: File, currentLogolUrl: string} = {currentFile: null, currentLogolUrl: null};

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private messageService: ApplicationMessageService,
    private loadingService: ApplicationLoadingService,
    private fileuploadService: FileUploadService,
    private bannerService: BannerService
  ) {

    this.newBannerForm = formBuilder.group({
      type: [null, Validators.required],
      bannerTitle: ['', Validators.required],
      text: ['', Validators.required],
      actionUrl: [''],
      hasStartDate:[false],
      startPublishDate: [null],
      hasEndDate:[false],
      endPublishDate: [null]
    });

    this.bannerTypes.push({label: 'Selecione o tipo de campanha', value: null});
    // this.bannerTypes.push({label: 'Welcome', value: 'WELCOME'});
    this.bannerTypes.push({label: 'Lançamentos', value: 'LAUNCH'});
    this.bannerTypes.push({label: 'Promoções', value: 'PROMO'});

    this.timeNow = new Date();
    this.minEndDate = this.timeNow;
   }

  ngOnInit() {
  }

  checkImageResponse(response: ILocalFileUploadResponse){
    if(response.isSuccess)
    {
      this.bannerFileParams.currentFile = response.file;
    }
    else
    {
      this.bannerFileParams.currentFile = null;
      this.messageService.showErrorMessage('Invalid image', response.message);
    }
    this.bannerFileParams.currentLogolUrl = null;
  }

  clearImage(){
    this.bannerFileParams.currentFile = null;
    this.bannerFileParams.currentLogolUrl = null;
    this.bannerMaskContainerStyle = null;
  }

  saveImage(){
    this.loadingService.showLoading();

    if(this.bannerFileParams.currentFile != null)
    {
      this.fileuploadService.uploadAppBanner(this.bannerFileParams.currentFile).subscribe((data: IAmazonUploadResponse)=>{
        console.log("server response", data);
        if(data.isSuccess)
        {
          this.bannerFileParams.currentFile = null;
          this.bannerFileParams.currentLogolUrl = data.fileUrl;

          if (this.newBannerForm.controls['type'].value !== 'WELCOME') {
            this.bannerMaskContainerStyle = {
              'background': 'url(' + data.fileUrl + ') no-repeat',
              'height': '420px',
              'width': '420px',
              'background-size': 'cover',
              'float': 'right'
            };
          }
        }
        else
        {
          this.bannerFileParams.currentLogolUrl = null;
          this.messageService.showErrorMessage('Upload server error', data.message);
        }
      },
      error=>{
          this.bannerFileParams.currentLogolUrl = null;
          this.messageService.showErrorMessage('Upload server error', error);
      },
      ()=>{
        this.loadingService.hideLoading();
      });
    }
    else
    {
      this.loadingService.hideLoading();
      this.messageService.showErrorMessage('Error trying to upload a image', 'File not found');
    }
  }

  removeCurrentLogo(){
    this.bannerFileParams.currentFile = null;
    this.bannerFileParams.currentLogolUrl = null;
    this.bannerMaskContainerStyle = null;
  }

  handleTypeSelection(type: string){

    if(type == 'WELCOME')
    {
      this.bannerHeight = 1242;
      this.bannerWidht = 1490;
    }
    else
    {
      this.bannerHeight = 1690;
      this.bannerWidht = 1690;
    }

    this.bannerFileParams.currentFile = null;
    this.bannerFileParams.currentLogolUrl = null;

  }

  handleStartDate(currentValue: boolean){
    if(!currentValue)
    {
      this.newBannerForm.controls["startPublishDate"].setValue(null);
      this.timeNow = new Date();
    }
  }

  handleEndDate(currentValue: boolean){
    if(!currentValue)
    {
      this.newBannerForm.controls["endPublishDate"].setValue(null);
      this.minEndDate = new Date();
    }
    else
    {
      if(this.newBannerForm.controls['startPublishDate'].value != null)
      {
        this.minEndDate = this.newBannerForm.controls['startPublishDate'].value;
      }
    }
  }

  checkScheduleDate(){
    if(this.newBannerForm.controls['startPublishDate'].value != null && this.newBannerForm.controls['endPublishDate'].value != null)
    {
      if(this.newBannerForm.controls['startPublishDate'].value >= this.newBannerForm.controls['endPublishDate'].value)
      {
        this.isScheduleValid = false;
        this.newBannerForm.controls["startPublishDate"].setValue(null);
        this.newBannerForm.controls["endPublishDate"].setValue(null);
        this.messageService.showErrorMessage("Agendamento Inválido", "A data de fim da campanha deve ser maior do que a data de publicação");
      }
      else
      {
        this.isScheduleValid = true;
      }
    }
    else
    {
      this.isScheduleValid = true;
    }
  }

  clearForm(){
    this.router.navigate(['/bannerManagement']);  
  }

  saveForm(){

    this.loadingService.showLoading();

    let bannerCreateRequest: IBannerCreateRequest = new IBannerCreateRequest();

    bannerCreateRequest.actionUrl = this.newBannerForm.controls["actionUrl"].value;
    bannerCreateRequest.type = this.newBannerForm.controls["type"].value;
    bannerCreateRequest.title = this.newBannerForm.controls["bannerTitle"].value;
    bannerCreateRequest.text = this.newBannerForm.controls["text"].value;
    bannerCreateRequest.startPublishDate = this.newBannerForm.controls["startPublishDate"].value;
    bannerCreateRequest.endPublishDate = this.newBannerForm.controls["endPublishDate"].value;

    if(bannerCreateRequest.type == 'WELCOME')
    {
      bannerCreateRequest.webAppFullImageUrl = null;
      bannerCreateRequest.webAppHalfImageUrl = this.bannerFileParams.currentLogolUrl;
    }
    else
    {
      bannerCreateRequest.webAppFullImageUrl = this.bannerFileParams.currentLogolUrl;
      bannerCreateRequest.webAppHalfImageUrl = null;
    }

    console.log('create-banner/saveForm() - bannerCreateRequest', bannerCreateRequest);

    this.bannerService.createBanner(bannerCreateRequest).subscribe((response)=>{
      this.router.navigate(['/bannerManagement']);    
    },
    error=>{
      this.messageService.showErrorMessage('Houve um erro ao tentar criar a campanha', error);
      this.loadingService.hideLoading();
    },
    ()=>{
      this.loadingService.hideLoading();
    });
  }

}
