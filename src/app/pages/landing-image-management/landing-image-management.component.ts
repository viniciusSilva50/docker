import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

// Models
import { IAmazonUploadResponse, ILocalFileUploadResponse } from '../../../models/fileupload-model';
import { ILandingImage, ILandingImageCreateRequest } from '../../../models/landing-image-model';

// Providers
import { ApplicationMessageService } from '../../../providers/application-message-service';
import { ApplicationLoadingService } from '../../../providers/application-loading-service';
import { ApplicationValidationService } from '../../../providers/application-validation-service';
import { LandingImageService } from '../../../providers/landing-image-service';
import { FileUploadService } from '../../../providers/fileupload-service';

@Component({
  selector: 'app-landing-image-management',
  templateUrl: './landing-image-management.component.html',
  styleUrls: ['./landing-image-management.component.css'],
  providers: [ LandingImageService, FileUploadService ]
})
export class LandingImageManagementComponent implements OnInit {

  landingHeight: number = 2560;
  landingWidht: number = 1441;
  currentImage: ILandingImage = null;
  landingFileParams: {currentFile: File, currentLogolUrl: string} = {currentFile: null, currentLogolUrl: null};

  constructor(private router: Router, private messageService: ApplicationMessageService, private loadingService: ApplicationLoadingService, private fileuploadService: FileUploadService, private landingImageService: LandingImageService) { 

    this.getImages();
  }

  getImages(){

    this.currentImage = null;
    this.landingFileParams.currentFile = null;
    this.landingFileParams.currentLogolUrl = null;

    this.landingImageService.getLandingImages().subscribe((landingImages: ILandingImage[])=>{
      if(landingImages.length > 0)
      {
        this.currentImage = landingImages[0];
        this.landingFileParams.currentLogolUrl = landingImages[0].imageUrl;
      }
    },
    error=>{
      this.messageService.showErrorMessage('Houve um erro ao tentar carregar a imagem Splash', error);
    });
  }

   checkImageResponse(response: ILocalFileUploadResponse){
    if(response.isSuccess)
    {
      this.landingFileParams.currentFile = response.file;
    }
    else
    {
      this.landingFileParams.currentFile = null;
      this.messageService.showErrorMessage('Invalid image', response.message);
    }
    this.landingFileParams.currentLogolUrl = null;
  }

  clearImage(){
    this.landingFileParams.currentFile = null;
    this.landingFileParams.currentLogolUrl = null;  
  }

  saveImage(){
    this.loadingService.showLoading();

    if(this.landingFileParams.currentFile != null)
    {
      this.fileuploadService.uploadAppLandingImage(this.landingFileParams.currentFile).subscribe((data: IAmazonUploadResponse)=>{
        console.log("server response", data);
        if(data.isSuccess)
        {
          this.landingFileParams.currentFile = null;
          this.landingFileParams.currentLogolUrl = data.fileUrl;
        }
        else
        {
          this.landingFileParams.currentLogolUrl = null;
          this.messageService.showErrorMessage('Upload server error', data.message);
        }
      },
      error=>{
          this.landingFileParams.currentLogolUrl = null;
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

  removeCurrentImage(){
    this.landingFileParams.currentFile = null;
    this.landingFileParams.currentLogolUrl = null;
  }

  cancel(){
    this.router.navigate(['/bannerManagement']);  
  }

  saveLandingImage(){

    this.loadingService.showLoading();

    let landingImageCreateRequest: ILandingImageCreateRequest = new ILandingImageCreateRequest();

    landingImageCreateRequest.startPublishDate = null
    landingImageCreateRequest.endPublishDate = null;
    landingImageCreateRequest.imageUrl = this.landingFileParams.currentLogolUrl;

    this.landingImageService.createLandingImage(landingImageCreateRequest).subscribe((response)=>{
      this.getImages();    
    },
    error=>{
      this.messageService.showErrorMessage('Houve um erro ao tentar criar a campanha', error);
      this.loadingService.hideLoading();
    },
    ()=>{
      this.loadingService.hideLoading();
    });
  }

  ngOnInit() {
  }

}
