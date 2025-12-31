import { ALBUMCACHE } from 'models/album.model';

const getAlbum = async (albumId: number) => {
  return await ALBUMCACHE.findOne({ albumId }).populate({
    path: 'tracks',
  });
};

const getAlbums = async () => {
  return await ALBUMCACHE.find()
    .populate({
      path: 'tracks',
      populate: {
        path: 'albumId',
        model: 'albums',
      },
    })
    .lean();
};

const deleteAlbum = async (albumId: string) => {
  return await ALBUMCACHE.findByIdAndDelete(albumId);
};

const saveAlbum = async (albumId: number, data: any) => {
  const album = await ALBUMCACHE.findOne({ albumId });

  if (!album) return ALBUMCACHE.create({ albumId, data, tracks: undefined });
};

export const ALBUM_REPO = {
  GET_ALBUM: getAlbum,
  GET_ALBUMS: getAlbums,
  DELETE_ALBUM: deleteAlbum,
  SAVE_ALBUM: saveAlbum,
};
