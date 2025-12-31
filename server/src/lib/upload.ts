import cloudinary from 'config/cloudinary';
import fileUpload from 'express-fileupload';
import { UTIL } from './utils';

const uploadToCloudinary = async (
  file: fileUpload.UploadedFile,
  folder = 'uploads'
) => {
  try {
    const base64String = file.data.toString('base64');
    const dataUri = `data:${file.mimetype};base64,${base64String}`;
    const result = await cloudinary.uploader.upload(dataUri, {
      folder,
      resource_type: 'auto',
    });

    return result.secure_url;
  } catch (error: any) {
    throw new Error(error?.message || 'Cloundinary upload failed!');
  }
};

const uploadLrcContent = async (lrc: string, public_id: string) => {
  const dataUri = UTIL.LRC_URI(lrc);

  const res = await cloudinary.uploader.upload(dataUri, {
    resource_type: 'raw',
    folder: 'lyrics',
    public_id: `${public_id}.lrc`,
    overwrite: true,
  });

  return {
    url: res.secure_url,
    assetId: res.asset_id,
  };
};

export const UPLOAD = {
  UPLOAD_FILE: uploadToCloudinary,
  UPLOAD_LRC: uploadLrcContent,
};
