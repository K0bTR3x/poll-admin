import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Spin, Empty, message } from "antd";
import { AddQuestionForm, QuestionCard } from "./index";
import api from "../../services/api";
import "./Questions.scss";

const Questions = () => {
    const { eventId } = useParams();
    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    // 🔹 Sualları backenddən çəkirik
    const fetchQuestions = async () => {
        try {
            setLoading(true);
            const res = await api.get(`/questions`);
            console.log("🔹 Suallar yükləndi:", res.data.data);
            setQuestions(res.data.data || []);
        } catch (err) {
            console.error("❌ Suallar yüklənmədi:", err);
            message.error("Suallar yüklənərkən xəta baş verdi.");
        } finally {
            setLoading(false);
        }
    };

    // 🔹 Yeni sual əlavə edəndə
    const handleAddQuestion = async (payload) => {
        try {
            setSubmitting(true);
            const res = await api.post("/questions", payload);
            // Yeni sualı siyahının əvvəlinə əlavə edirik
            setQuestions((prev) => [res.data, ...prev]);
            message.success("Yeni sual əlavə olundu!");
        } catch (err) {
            console.error("❌ Sual yaradılmadı:", err);
            message.error("Sual əlavə edilərkən xəta baş verdi.");
        } finally {
            setSubmitting(false);
        }
    };

    // 🔹 Sualı siləndə
    const handleDeleteQuestion = async (id) => {
        try {
            await api.delete(`/questions/${id}`);
            setQuestions((prev) => prev.filter((q) => q.id !== id));
            message.success("Sual silindi.");
        } catch (err) {
            console.error("❌ Sual silinmədi:", err);
            message.error("Sual silinərkən xəta baş verdi.");
        }
    };

    // 🔹 Inline edit üçün (hələ PUT qoşmuruq, Addım 4-də əlavə edəcəyik)
    const handleSaveQuestion = async (id, values) => {
        message.info(`Sual ${id} üçün dəyişiklik saxlanılacaq (Addım 4-də).`);
    };

    useEffect(() => {
        if (eventId) fetchQuestions();
    }, [eventId]);

    return (
        <div className="questions-ui" style={{ padding: 20 }}>
            <AddQuestionForm
                meetingId={eventId}
                onSubmit={handleAddQuestion}
                loading={submitting}
            />

            {loading ? (
                <div style={{ textAlign: "center", padding: 50 }}>
                    <Spin size="large" />
                </div>
            ) : questions.length === 0 ? (
                <Empty description="Hələ heç bir sual yoxdur" />
            ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 16, marginTop: 20 }}>
                    {questions.map((q) => (
                        <QuestionCard
                            key={q.id}
                            question={q}
                            onDelete={handleDeleteQuestion}
                            onSave={handleSaveQuestion}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default Questions;
