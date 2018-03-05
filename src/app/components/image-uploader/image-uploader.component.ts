import { Component, Output, EventEmitter, Input, OnInit } from '@angular/core';

import { ILocalFileUploadResponse } from '../../../models/fileupload-model';

@Component({
  selector: 'app-image-uploader',
  templateUrl: './image-uploader.component.html',
  styleUrls: ['./image-uploader.component.scss'],
  inputs:['activeColor','baseColor','overlayColor']
})

export class ImageUploaderComponent implements OnInit {

@Input() fileSize: number = null;
@Input() imageMinWidth: number = 10;
@Input() imageMaxWidth: number = 500;
@Input() imageMinHeight: number = 10;
@Input() imageMaxHeight: number = 500;
@Input() componentTitle: string = null;
@Input() isRequired: boolean = false;

@Output() onSelect: EventEmitter<ILocalFileUploadResponse> = new EventEmitter<ILocalFileUploadResponse>();
@Output() onSaveClick: EventEmitter<void> = new EventEmitter<void>();
@Output() onClearClick: EventEmitter<void> = new EventEmitter<void>();


    activeColor: string = 'green';
    baseColor: string = '#ccc';
    overlayColor: string = 'rgba(255,255,255,0.5)';
    
    dragging: boolean = false;
    loaded: boolean = false;
    imageLoaded: boolean = false;
    imageSrc: string = '';
    fileSpec: string = null;

    constructor() {
        this.componentTitle = "Selecione uma imagem";
    }

    ngOnInit(){

        if(this.fileSize != null)
        {
            this.fileSpec = 'Tamanho do arquivo' + ': ' + this.sizeToHuman(this.fileSize) + '.';
        }
        if(this.imageMinHeight != null && this.imageMaxHeight != null)
        {
            if(this.fileSpec == null)
            {
                this.fileSpec = 'Altura mínima: ' + this.imageMinHeight + ' px. e máxima: ' + this.imageMaxHeight + ' px.';
            }
            else
            {
                this.fileSpec = this.fileSpec + '\r\n' + 'Altura mínima: ' + this.imageMinHeight + ' px. e máxima: ' + this.imageMaxHeight + ' px.';
            }
        }
        if(this.imageMinWidth != null && this.imageMaxWidth != null)
        {
            if(this.fileSpec == null)
            {
                this.fileSpec = 'Largura mínima: ' + this.imageMinWidth + ' px. e máxima:' + this.imageMaxWidth + ' px.';
            }
            else
            {
                this.fileSpec = this.fileSpec + '\r\n' + 'Largura mínima: ' + this.imageMinWidth + ' px. e máxima:' + this.imageMaxWidth + ' px.';
            }
        }
    }
    
    handleDragEnter() {
        this.dragging = true;
    }
    
    handleDragLeave() {
        this.dragging = false;
    }
    
    handleDrop(e) {
        e.preventDefault();
        this.dragging = false;
        this.handleInputChange(e);
    }
    
    handleImageLoad() {
        this.imageLoaded = true;
    }

    handleInputChange(e) {

        this.imageSrc = '';
        this.loaded = false;
     
        // Initializing the response
        let response : ILocalFileUploadResponse = new ILocalFileUploadResponse();

        var file = e.dataTransfer ? e.dataTransfer.files[0] : e.target.files[0];
        let self = this;

        let fileName: string = file.name;

        if(/^[a-zA-Z0-9-. ]*$/.test(fileName) == false)
        {
            response.isSuccess = false;
            response.message = 'The file name contains special characters. Please, rename the file only with numbers, letters or space';
            response.file = null;
            self.onSelect.emit(response);
        }
        else if (file.type.match('image/*'))
        {
            if(self.fileSize == null || self.fileSize >= file.size)
            {
                // Initialize File Reader
                var reader = new FileReader();

                // Read Image file
                reader.readAsDataURL(file);  

                // Treat the read result
                reader.onload = function(){
                
                    // Initialize de Image
                    let myImage = new Image();
                    myImage.src= reader.result;

                    // Treat the image load
                    myImage.onload = function (){

                        let imageHeight = myImage.height;
                        let imageWidth = myImage.width;

                        if( imageHeight >= self.imageMinHeight && imageHeight <= self.imageMaxHeight && imageWidth >= self.imageMinWidth && imageWidth <= self.imageMaxWidth )
                        {
                            self.imageSrc = reader.result;
                            self.loaded = true;
                            response.isSuccess = true;
                            response.message = 'Imagem carregada!';
                            response.file = file;
                            self.onSelect.emit(response);
                        }
                        else
                        {
                            response.isSuccess = false;
                            response.message = 'Dimensão da imagem não permitida! Altura Min: ' + self.imageMinHeight + 'px. Max: ' + self.imageMaxHeight + 'px. Largura Min: ' + self.imageMinWidth + 'px. Max: ' + self.imageMaxWidth + 'px. Imagem: ' + imageHeight + ' x ' + imageWidth;
                            response.file = null;
                            self.onSelect.emit(response);
                        }
                    }
                };
            }
            else
            {
                response.isSuccess = false;
                response.message = 'Tamanho do arquivo não permitido! Esperado menor que: ' + this.sizeToHuman(self.fileSize) + '. ' + 'Arquivo: ' + this.sizeToHuman(file.size);
                response.file = null;
                self.onSelect.emit(response);
            }
        //console.log('FileUploaderComponent/handleInputChange - response', response);
        }
        else
        {
            response.isSuccess = false;
            response.message = 'O arquivo não é uma imagem válida!';
            response.file = null;
            self.onSelect.emit(response);
            //console.log('FileUploaderComponent/handleInputChange - response', response);
        } 
    }

    saveImage(){
        this.imageSrc = '';
        this.loaded = false;
        this.onSaveClick.emit();
    }

    clearImage(){
        this.imageSrc = '';
        this.loaded = false;
        this.onClearClick.emit();
    }

    sizeToHuman(size: number) : string
    {
        var fSExt = new Array('Bytes', 'KB', 'MB', 'GB'),
        i=0;while(size>900){size/=1024;i++;}
        var exactSize = (Math.round(size*100)/100)+' '+fSExt[i];
        return exactSize;
    }
}