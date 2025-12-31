export const getDeviceId = () => {
  //   const stored = localStorage.getItem('deviceId');

  //   if (stored) return stored;

  const newId = crypto.randomUUID();
  //   localStorage.setItem('deviceId', newId);

  return newId;
};
