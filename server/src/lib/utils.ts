const lrcToDataUri = (lrc: string) => {
  const base64 = Buffer.from(lrc, 'utf8').toString('base64');

  return `data:text/plain;base64,${base64}`;
};

export const UTIL = {
  LRC_URI: lrcToDataUri,
};
