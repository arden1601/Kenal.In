const mainRoute = import.meta.env.MAIN_ROUTE || "localhost:8000";

const authRoute = {
  login: `http://${mainRoute}/login`,
  register: `http://${mainRoute}/register`,
};

const eventsRoute = {
  main: `http://${mainRoute}/events`,
  getById: (id) => `http://${mainRoute}/events/${id}`,
  presensi: (eventId) => `http://${mainRoute}/events-presensi/${eventId}`,
};

const faceRoute = {
  recognize: `http://${mainRoute}/recognize-face`,
};

export const apiRoute = {
  auth: authRoute,
  events: eventsRoute,
  face: faceRoute,
};
