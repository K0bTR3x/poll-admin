// src/services/eventService.js
import api from "./api";

export const getEvents = () => api.get("/meetings");
export const getEventById = (id) => api.get(`/meetings/${id}`);
export const createEvent = (data) => api.post("/meetings", data);
export const updateEvent = (id, data) => api.put(`/meetings/${id}`, data);
export const deleteEvent = (id) => api.delete(`/meetings/${id}`);
