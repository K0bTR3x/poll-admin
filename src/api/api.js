import axios from "axios";

const BASE_URL = process.env.REACT_APP_API_BASE_URL;

export const api = axios.create({
    baseURL: BASE_URL,
});

// Events
export const getEvents = () => api.get("/events");
export const createEvent = (data) => api.post("/events", data);
export const updateEvent = (id, data) => api.put(`/events/${id}`, data);
export const deleteEvent = (id) => api.delete(`/events/${id}`);

// Login
export const loginUser = (username, password) =>
    api.get(`/users?username=${username}&password=${password}`);
