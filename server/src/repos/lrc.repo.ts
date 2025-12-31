import { LRCCACHE } from 'models/lrc.model';

const getLrcfile = async (trackId: number) => {
  return await LRCCACHE.findOne({ trackId });
};

const getLrcFiles = async () => {
  return await LRCCACHE.find().lean();
};

const saveLrc = async (trackId: number, url: string) => {
  const lrc = await LRCCACHE.findOne({ trackId });

  if (lrc) {
    await LRCCACHE.findOneAndUpdate(
      { trackId },
      { lyrics: { format: 'lrc', url } },
      { upsert: true, new: true }
    );
  } else {
    await LRCCACHE.create({
      trackId,
      lyrics: { format: 'lrc', url },
    });
  }
};

export const LRC_REPO = {
  GET_LRC: getLrcfile,
  GET_LRC_FILES: getLrcFiles,
  SAVE_LRC: saveLrc,
};
