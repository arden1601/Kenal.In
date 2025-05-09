const mainRoute = import.meta.env.MAIN_ROUTE || 'localhost:8000';
const authRoute = {
    login: `http://${mainRoute}/api/auth/login`,
    register: `http://${mainRoute}/api/auth/register`,
}

const eventsRoute = {
    main: `http://${mainRoute}/events`,
    getById: (id) => `http://${mainRoute}/events/${id}`,
    presensi: (eventId) => `http://${mainRoute}/events-presensi/${eventId}`,
}

export const apiRoute = {
    auth: authRoute,
    events: eventsRoute,
}
