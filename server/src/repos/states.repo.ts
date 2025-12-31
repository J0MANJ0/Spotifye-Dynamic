// import { PLAYBACKSTATE } from 'models/states.model';
// import { PlaybackState } from 'socket/handlers/playback';

// const saveState = async (userId: string, state: PlaybackState) => {
//   try {
//     await PLAYBACKSTATE.findOneAndUpdate(
//       { userId },
//       { state, lastUpdated: new Date() },
//       { upsert: true }
//     );

//     console.log(`Saved states for ${userId}`);
//   } catch (error) {
//     console.error('STATE DB SAVE ERROR:', error);
//   }
// };

// const loadState = async (userId: string) => {
//   try {
//     const doc = await PLAYBACKSTATE.findOne({ userId });
//     return doc ? doc.state : null;
//   } catch (error) {
//     console.error('STATE DB LOAD ERROR:', error);
//   }
// };

// export const PLAYBACKSTATE_REPO = {
//   SAVE_STATE: saveState,
//   LOAD_STATE: loadState,
// };
