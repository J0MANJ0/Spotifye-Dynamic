import fileUpload from 'express-fileupload';

export interface AudioUploadFiles {
  audioFile: fileUpload.UploadedFile;
}
