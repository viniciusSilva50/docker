export class IAmazonUploadResponse
{
    isSuccess: boolean;
    message: string;
    fileUrl: string;
}

export class ILocalFileUploadResponse
{
    isSuccess: boolean;
    message: string;
    file: File;
}
