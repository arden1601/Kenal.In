const mainRoute = import.meta.env.VITE_MAIN_ROUTE || "localhost:8000";

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
