import fileUpload from 'express-fileupload';

declare global {
  namespace Express {
    interface Request {
      files?: {
        audioFile: fileUpload.UploadedFile;
      };
    }
  }
}

export {};
