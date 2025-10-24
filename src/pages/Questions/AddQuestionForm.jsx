import React from "react";
import {
    Card,
    Form,
    Input,
    Switch,
    Button,
    Row,
    Col,
    Select,
    Divider,
} from "antd";
import { FiPlus, FiTrash2 } from "react-icons/fi";
import "./AddQuestionForm.scss";

const { Option } = Select;

const AddQuestionForm = ({ meetingId, onSubmit, loading }) => {
    const [form] = Form.useForm();

    // 🔹 Form submit
    const handleFinish = (values) => {
        console.log("🔹 Form dəyərləri:", values);

        // 🔸 Variantları backend formatına çeviririk
        const answers = values.answers.map((opt, index) => ({
            text: opt.text,
            is_custom: opt.type === "textarea", // textarea seçilibsə true
            status: true,
            sort_order: index + 1,
        }));

        const payload = {
            title: values.title,
            subtitle: values.subtitle,
            status: values.status,
            is_multi: values.is_multi,
            meeting_id: Number(meetingId),
            answers,
        };

        console.log("📤 Göndərilən payload:", payload);
        onSubmit(payload);
        form.resetFields();
    };

    return (
        <Card
            className="add-question-card"
            title={
                <span style={{ fontSize: 17, fontWeight: 600, color: "var(--color-text)" }}>
                    📝 Yeni Sual Əlavə Et
                </span>
            }
            bordered={false}
            style={{
                background: "var(--color-card-bg)",
                boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                borderRadius: 16,
                padding: 20,
                marginBottom: 30,
            }}
            headStyle={{
                borderBottom: "1px solid var(--color-border)",
                color: "var(--color-text)",
            }}
        >
            <Form
                layout="vertical"
                form={form}
                onFinish={handleFinish}
                initialValues={{
                    status: true,
                    is_multi: false,
                    answers: [{ text: "", type: "input" }],
                }}
            >
                <Row gutter={[16, 16]}>
                    <Col xs={24} md={12}>
                        <Form.Item
                            label={<span style={{ color: "var(--color-text)" }}>Başlıq</span>}
                            name="title"
                            rules={[{ required: true, message: "Başlıq daxil edin" }]}
                        >
                            <Input placeholder="Sualın başlığı..." className="custom-input" />
                        </Form.Item>
                    </Col>

                    <Col xs={24} md={12}>
                        <Form.Item
                            label={<span style={{ color: "var(--color-text)" }}>Alt Başlıq</span>}
                            name="subtitle"
                        >
                            <Input
                                placeholder="İstəyə bağlı alt başlıq..."
                                className="custom-input"
                            />
                        </Form.Item>
                    </Col>

                    <Col xs={24} sm={12} md={6}>
                        <Form.Item
                            name="status"
                            label={<span style={{ color: "var(--color-text)" }}>Status</span>}
                            valuePropName="checked"
                        >
                            <Switch checkedChildren="Aktiv" unCheckedChildren="Passiv" />
                        </Form.Item>
                    </Col>

                    <Col xs={24} sm={12} md={6}>
                        <Form.Item
                            name="is_multi"
                            label={<span style={{ color: "var(--color-text)" }}>Çoxseçimli</span>}
                            valuePropName="checked"
                        >
                            <Switch checkedChildren="Bəli" unCheckedChildren="Xeyr" />
                        </Form.Item>
                    </Col>
                </Row>

                <Divider style={{ borderColor: "var(--color-border)" }}>
                    Variantlar
                </Divider>

                {/* 🔹 Variantlar hissəsi */}
                <Form.List name="answers">
                    {(fields, { add, remove }) => (
                        <div className="variant-section">
                            {fields.map(({ key, name, ...restField }) => (
                                <div key={key} className="variant-item">
                                    <Row gutter={[12, 12]} align="middle">
                                        <Col xs={24} md={10}>
                                            <Form.Item
                                                {...restField}
                                                name={[name, "text"]}
                                                rules={[
                                                    { required: true, message: "Variant mətni boş ola bilməz" },
                                                ]}
                                            >
                                                <Input
                                                    placeholder="Variant mətni"
                                                    className="custom-input"
                                                />
                                            </Form.Item>
                                        </Col>

                                        <Col xs={24} md={10}>
                                            <Form.Item
                                                {...restField}
                                                name={[name, "type"]}
                                                initialValue="input"
                                                rules={[{ required: true, message: "Tip seçilməlidir" }]}
                                            >
                                                <Select className="custom-select">
                                                    <Option value="input">Input</Option>
                                                    <Option value="textarea">Textarea</Option>
                                                </Select>
                                            </Form.Item>
                                        </Col>

                                        <Col xs={24} md={4} style={{ textAlign: "center" }}>
                                            <Button
                                                danger
                                                type="text"
                                                icon={<FiTrash2 size={16} />}
                                                onClick={() => remove(name)}
                                            />
                                        </Col>
                                    </Row>
                                </div>
                            ))}

                            <Button
                                type="dashed"
                                onClick={() => add({ text: "", type: "input" })}
                                icon={<FiPlus />}
                                className="add-option-btn"
                            >
                                Variant əlavə et
                            </Button>
                        </div>
                    )}
                </Form.List>

                <div style={{ marginTop: 24 }}>
                    <Button
                        type="primary"
                        htmlType="submit"
                        icon={<FiPlus />}
                        loading={loading}
                        className="create-btn"
                    >
                        Sual Yarat
                    </Button>
                </div>
            </Form>
        </Card>
    );
};

export default AddQuestionForm;
