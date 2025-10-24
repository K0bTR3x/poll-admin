import api from "./api";

export const getQuestionsByMeeting = async (meetingId) => {
    const res = await api.get(`/questions/${meetingId}`);
    const raw = res.data.data;
    const data = Array.isArray(raw) ? raw : [raw];
    return { data };
};


// 🔹 Yeni sual yarat
export const createQuestion = (data) => api.post("/questions", data);

// 🔹 Sual sil
export const deleteQuestion = (id) => api.delete(`/questions/${id}`);

// 🔹 Sual redaktə (hazırda istifadə edilmir, amma əlavə et)
export const updateQuestion = (id, data) => api.put(`/questions/${id}`, data);
