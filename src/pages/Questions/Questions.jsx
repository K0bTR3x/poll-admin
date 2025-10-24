import React, { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Spin, Empty, message } from "antd";
import { Toaster } from "react-hot-toast";

import {
    createQuestion,
    deleteQuestion,
    selectQuestionsStatus,
} from "../../store/slices/questionSlice/questionSlice";

import { AddQuestionForm, QuestionCard } from "./index";
import { getMeetingById } from "../../services/meetingService";
import "./Questions.scss";

const Questions = () => {
    const { id: meetingId } = useParams();
    const dispatch = useDispatch();
    const status = useSelector(selectQuestionsStatus);

    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    // 🔹 Sualları gətirən funksiya
    const fetchQuestions = useCallback(async () => {
        try {
            setLoading(true);
            const res = await getMeetingById(meetingId);
            setQuestions(res.data?.data?.questions || []);
        } catch (err) {
            console.error("❌ Suallar yüklənmədi:", err);
            message.error("Suallar yüklənərkən xəta baş verdi.");
        } finally {
            setLoading(false);
        }
    }, [meetingId]);

    // 🔹 İlk yüklənmədə çağır
    useEffect(() => {
        if (meetingId) fetchQuestions();
    }, [meetingId, fetchQuestions]);

    const handleAddQuestion = async (payload) => {
        try {
            setSubmitting(true);
            const newQuestion = { ...payload, meeting_id: Number(meetingId) };

            const res = await dispatch(createQuestion(newQuestion)).unwrap();

            // ✅ Gələn cavab obyektini təmiz formaya salaq
            const created =
                res?.data && typeof res.data === "object"
                    ? res.data
                    : res?.id
                        ? res
                        : null;

            if (created) {
                // ⚡️ React-ın dəyişiklik detektorunu tetiklə
                setQuestions((prev) => {
                    const updated = [created, ...prev];
                    return JSON.parse(JSON.stringify(updated)); // yeni referens
                });
            }

            message.success("Yeni sual əlavə olundu!");
        } catch (err) {
            console.error("❌ Sual yaradılmadı:", err);
            message.error(err?.message || "Sual əlavə edilərkən xəta baş verdi.");
        } finally {
            setSubmitting(false);
        }
    };




    // 🔹 Sualı sil
    const handleDeleteQuestion = async (id) => {
        try {
            await dispatch(deleteQuestion(id)).unwrap();
            message.success("Sual silindi.");

            // ✅ Silindikdən sonra yenilə
            setQuestions((prev) => prev.filter((q) => q.id !== id));
        } catch (err) {
            console.error("❌ Sual silinmədi:", err);
            message.error("Sual silinərkən xəta baş verdi.");
        }
    };

    // 🔹 Sualı redaktə et (placeholder)
    const handleSaveQuestion = async (id, values) => {
        message.info(`Sual ${id} üçün dəyişiklik saxlanılacaq (tezliklə).`);
    };

    return (
        <div className="questions-ui" style={{ padding: 20 }}>
            <Toaster position="top-right" />

            {/* 🔹 Yeni sual əlavə formu */}
            <AddQuestionForm
                meetingId={meetingId}
                onSubmit={handleAddQuestion}
                loading={submitting}
            />

            {/* 🔹 Məzmun hissəsi */}
            {loading ? (
                <div style={{ textAlign: "center", padding: 50 }}>
                    <Spin size="large" tip="Yüklənir..." />
                </div>
            ) : questions.length === 0 ? (
                <Empty description="Hələ heç bir sual yoxdur" />
            ) : (
                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 16,
                        marginTop: 20,
                    }}
                >
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
