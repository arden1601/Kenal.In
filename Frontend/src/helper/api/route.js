const mainRoute = "https://be-senpro.azurewebsites.net";

const authRoute = {
  login: `${mainRoute}/login`,
  register: `${mainRoute}/register`,
};

const eventsRoute = {
  main: `${mainRoute}/events`,
  getById: (id) => `${mainRoute}/events/${id}`,
  presensi: (eventId) => `${mainRoute}/events-presensi/${eventId}`,
};

const faceRoute = {
  recognize: `${mainRoute}/recognize-face`,
};

export const apiRoute = {
  auth: authRoute,
  events: eventsRoute,
  face: faceRoute,
};
