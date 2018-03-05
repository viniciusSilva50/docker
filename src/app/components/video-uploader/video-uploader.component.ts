import { Component, Output, EventEmitter, Input, ViewChild, OnInit} from '@angular/core';

import { ILocalFileUploadResponse } from '../../../models/fileupload-model';

@Component({
  selector: 'app-video-uploader',
  templateUrl: './video-uploader.component.html',
  styleUrls: ['./video-uploader.component.scss'],
  inputs:['activeColor','baseColor','overlayColor']
})

export class VideoUploaderComponent implements OnInit {

@Input() fileSize: number = null;
@Input() videoDuration: number = null;
@Input() componentTitle: string = 'Select a video';
@Input() isRequired: boolean = false;

@Output() onSelect: EventEmitter<ILocalFileUploadResponse> = new EventEmitter<ILocalFileUploadResponse>();
@Output() onSaveClick: EventEmitter<void> = new EventEmitter<void>();
@Output() onClearClick: EventEmitter<void> = new EventEmitter<void>();

@ViewChild('videoPlayer') videoPlayer;

    activeColor: string = 'green';
    baseColor: string = '#ccc';
    overlayColor: string = 'rgba(255,255,255,0.5)';
    videoName: string = null;
    fileSpec: string = null;
    
    dragging: boolean = false;
    loaded: boolean = false;
    videoLoaded: boolean = false;
    videoSrc: string = '';

    constructor() {}

    ngOnInit(){

        if(this.fileSize != null)
        {
            this.fileSpec = 'Tamanho do arquivo: ' + this.sizeToHuman(this.fileSize) + '.';
        }
        if(this.videoDuration != null)
        {
            if(this.fileSpec == null)
            {
                this.fileSpec = 'Duração máxima do vídeo: ' + this.videoDuration + ' ' + 'segundos.';
            }
            else
            {
                this.fileSpec = this.fileSpec + '\r\n' + 'Duração máxima do vídeo: ' + this.videoDuration + ' ' + 'segundos.';
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
    
    handlevideoLoad() {
        this.videoLoaded = true;
    }

    handleInputChange(e) {

        this.videoSrc = '';
        this.videoName = null;
        this.loaded = false;
     
        // Initializing the response
        let response : ILocalFileUploadResponse = new ILocalFileUploadResponse();

        var file = e.dataTransfer ? e.dataTransfer.files[0] : e.target.files[0];
        let self = this;

        //console.log('VideoUploaderComponent/handleInputChange - file', file);
        
        let fileName: string = file.name;

        if(/^[a-zA-Z0-9-. ]*$/.test(fileName) == false)
        {
            response.isSuccess = false;
            response.message = 'O nome do arquivo contem caracteres especiais. Por favor, renomeio  arquivo apenas com numeros, letras ou espaço';
            response.file = null;
            self.onSelect.emit(response);
        }
        else if (file.type == 'video/mp4')
        {
            if(self.fileSize == null || self.fileSize >= file.size)
            {
                // Initialize File Reader
                var reader = new FileReader();

                // Read video file
                reader.readAsDataURL(file);

                // Treat the read result
                reader.onload = function(){

                    self.videoPlayer.nativeElement.src = reader.result;

                    setTimeout(()=>{
                        let videoDuration = self.videoPlayer.nativeElement.duration;

                        // console.log('VideoUploaderComponent/handleInputChange - videoDuration', videoDuration);
                        // console.log('VideoUploaderComponent/handleInputChange - expectedDuration', self.videoDuration);

                        if(self.videoDuration == null || self.videoDuration >= videoDuration)
                        {
                            self.videoSrc = self.videoPlayer.nativeElement.src;
                            self.loaded = true;
                            self.videoName = file.name;
                            response.isSuccess = true;
                            response.message = 'Arquivo de vídeo carregado!';
                            response.file = file;
                            self.onSelect.emit(response);
                        }
                        else
                        {
                            response.isSuccess = false;
                            response.message = 'Duração do vídeo não permitida! Esprado menos que: ' + self.videoDuration + 'segundos. Arquivo: ' + videoDuration + ' ' + 'segundos';
                            response.file = null;
                            self.onSelect.emit(response);
                        }
                    },800);
                };
            }
            else
            {
                response.isSuccess = false;
                response.message = 'Tamanho de arquivo não permitido! Esperado menor que: ' + this.sizeToHuman(self.fileSize) + '. ' + 'Arquivo: ' + this.sizeToHuman(file.size);
                response.file = null;
                self.onSelect.emit(response);
            }
        //console.log('VideoUploaderComponent/handleInputChange - response', response);
        }
        else
        {
            response.isSuccess = false;
            response.message = 'O arquivo (' + file.type + ') não é um formato válido. Esperado: .mp4';
            response.file = null;
            self.onSelect.emit(response);
            //console.log('VideoUploaderComponent/handleInputChange - response', response);
        } 
    }

    saveVideo(){
        this.videoSrc = '';
        this.videoName = null;
        this.loaded = false;
        this.onSaveClick.emit();
    }

    clearVideo(){
        this.videoSrc = '';
        this.videoName = null;
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