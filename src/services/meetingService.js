// src/services/MeetingService.js
import api from "./api";
export const getMeetings = () => {
    return api.get("/meetings");
};
export const getMeetingById = (id) => {
    return api.get(`/meetings/${id}`);
};
export const createMeeting = (formData) => {
    return api.post("/meetings", formData, {
        headers: { "Content-Type": "multipart/form-data" },
    });
};
export const updateMeeting = (id, formData) => {
    formData.append("_method", "PUT"); // Laravel PUT emulyasiyası

    return api.post(`/meetings/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
    });
};
export const deleteMeeting = (id) => {
    return api.delete(`/meetings/${id}`);
};
