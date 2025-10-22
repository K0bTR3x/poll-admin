import React, { useState } from "react";
import { Button, Input, Select, Space, Card, Row, Col, Typography } from "antd";
import { useParams, useNavigate } from "react-router-dom";
import { FiPlus, FiTrash2, FiArrowLeft } from "react-icons/fi";
import toast, { Toaster } from "react-hot-toast";
import api from "../../services/api";
import "./AddQuestion.scss";

const { Option } = Select;
const { Title } = Typography;

const AddQuestion = () => {
    const { eventId } = useParams();
    const navigate = useNavigate();

    const [questionTitle, setQuestionTitle] = useState("");
    const [questionType, setQuestionType] = useState("radio");
    const [options, setOptions] = useState([{ text: "", inputType: "input" }]);
    const [loading, setLoading] = useState(false);

    const handleAddOption = () => {
        setOptions([...options, { text: "", inputType: "input" }]);
    };

    const handleRemoveOption = (index) => {
        setOptions(options.filter((_, i) => i !== index));
    };

    const handleOptionChange = (index, field, value) => {
        const updated = [...options];
        updated[index][field] = value;
        setOptions(updated);
    };

    const handleSubmit = async () => {
        if (!questionTitle.trim()) {
            toast.error("Sualın başlığını yazmaq vacibdir!");
            return;
        }

        if (options.some((opt) => !opt.text.trim())) {
            toast.error("Bütün variantları doldurun!");
            return;
        }

        const payload = {
            event_id: eventId,
            title: questionTitle,
            type: questionType,
            options: options.map((opt) => ({
                text: opt.text,
                input_type: opt.inputType,
            })),
        };

        try {
            setLoading(true);
            await api.post(`/events/${eventId}/questions`, payload);
            toast.success("Sual əlavə olundu!");
            setTimeout(() => navigate(`/events/${eventId}/questions`), 1000);
        } catch (err) {
            console.error(err);
            toast.error("Sual əlavə edilə bilmədi!");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="add-question-page">
            <Toaster position="top-right" />
            <Card className="add-question-card">
                <Space align="center" style={{ marginBottom: 20 }}>
                    <Button
                        type="default"
                        icon={<FiArrowLeft />}
                        onClick={() => navigate(-1)}
                    >
                        Geri
                    </Button>
                    <Title level={3} style={{ margin: 0 }}>
                        Yeni sual əlavə et
                    </Title>
                </Space>

                <Row gutter={[16, 16]}>
                    <Col span={24}>
                        <label>Sualın başlığı</label>
                        <Input
                            placeholder="Məsələn: Tədbirdən nə qədər məmnunsunuz?"
                            value={questionTitle}
                            onChange={(e) => setQuestionTitle(e.target.value)}
                        />
                    </Col>

                    <Col span={24}>
                        <label>Sualın tipi</label>
                        <Select
                            style={{ width: "100%" }}
                            value={questionType}
                            onChange={(v) => setQuestionType(v)}
                        >
                            <Option value="radio">Radio (bir seçim)</Option>
                            <Option value="multichoice">Çox seçim</Option>
                        </Select>
                    </Col>

                    <Col span={24}>
                        <label>Cavab variantları</label>

                        {options.map((opt, index) => (
                            <Space
                                key={index}
                                align="start"
                                style={{
                                    display: "flex",
                                    marginBottom: 10,
                                    width: "100%",
                                }}
                            >
                                <Input
                                    placeholder={`Variant ${index + 1}`}
                                    value={opt.text}
                                    onChange={(e) =>
                                        handleOptionChange(index, "text", e.target.value)
                                    }
                                    style={{ flex: 1 }}
                                />
                                <Select
                                    value={opt.inputType}
                                    style={{ width: 150 }}
                                    onChange={(v) =>
                                        handleOptionChange(index, "inputType", v)
                                    }
                                >
                                    <Option value="input">Input</Option>
                                    <Option value="textarea">Textarea</Option>
                                </Select>

                                <Button
                                    danger
                                    icon={<FiTrash2 />}
                                    onClick={() => handleRemoveOption(index)}
                                />
                            </Space>
                        ))}

                        <Button
                            type="dashed"
                            icon={<FiPlus />}
                            onClick={handleAddOption}
                            style={{ width: "100%", marginTop: 10 }}
                        >
                            Yeni variant əlavə et
                        </Button>
                    </Col>
                </Row>

                <Button
                    type="primary"
                    loading={loading}
                    onClick={handleSubmit}
                    style={{ marginTop: 20 }}
                >
                    Sualı əlavə et
                </Button>
            </Card>
        </div>
    );
};

export default AddQuestion;
