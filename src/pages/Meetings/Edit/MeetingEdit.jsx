import React, { useEffect, useState } from "react";
import {
    Form,
    Input,
    DatePicker,
    Select,
    Button,
    InputNumber,
    Upload,
    Spin,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useSelector, useDispatch } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { toast, Toaster } from "react-hot-toast";
import dayjs from "dayjs";
import {
    fetchMeetingById,
    updateMeeting,
    selectMeetingById,
    selectMeetingsStatus,
} from "../../../store/slices/meetingSlice/meetingSlice";
import "./MeetingEdit.scss";

const { Option } = Select;

const MeetingEdit = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { id } = useParams();

    const token = useSelector((state) => state.auth.token);
    const status = useSelector(selectMeetingsStatus);
    const meeting = useSelector((state) => selectMeetingById(state, Number(id)));

    const [imageFile, setImageFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [form] = Form.useForm();

    // 🧠 İlk açıldıqda meeting məlumatlarını çək
    useEffect(() => {
        dispatch(fetchMeetingById({ id, token }));
    }, [id, token, dispatch]);

    useEffect(() => {
        if (meeting) {
            const data = meeting.data ? meeting.data : meeting; // bəzi hallarda meeting.data olur
            form.setFieldsValue({
                title: data.title,
                description: data.description,
                start_time: dayjs(data.start_time, "DD MMMM YYYY HH:mm"),
                end_time: dayjs(data.end_time, "DD MMMM YYYY HH:mm"),
                max_user_count: data.max_user_count,
                status: data.status,
            });
            if (data.image) {
                setPreview(data.image);
            }
        }
    }, [meeting, form]);

    const handleFileChange = (info) => {
        const file = info.file.originFileObj || info.file;
        if (file) {
            setImageFile(file);
            setPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (values) => {
        const formData = new FormData();
        formData.append("title", values.title);
        formData.append("description", values.description);
        formData.append("start_time", dayjs(values.start_time).format("YYYY-MM-DD HH:mm"));
        formData.append("end_time", dayjs(values.end_time).format("YYYY-MM-DD HH:mm"));
        formData.append("status", values.status);
        formData.append("max_user_count", values.max_user_count);
        if (imageFile) formData.append("image", imageFile);

        try {
            dispatch(updateMeeting({ id, formData, token }))
                .unwrap()
                .then(() => {
                    toast.success("Meeting uğurla güncəlləndi!");
                    navigate("/meetings");
                })
                .catch((err) => {
                    toast.error(err || "Meeting güncəllənərkən xəta baş verdi!");
                });
        } catch (err) {
            toast.error(err || "Meeting güncəllənərkən xəta baş verdi!");
        }
    };

    if (status === "loading" && !meeting) {
        return (
            <div className="meeting-edit-loading">
                <Spin size="large" />
            </div>
        );
    }

    return (
        <div className="meeting-edit-page">
            <Toaster position="top-right" />
            <div className="form-container">
                <h2>Tədbiri Güncəllə</h2>

                <Form layout="vertical" form={form} onFinish={handleSubmit}>
                    <Form.Item
                        label="Başlıq"
                        name="title"
                        rules={[{ required: true, message: "Başlıq mütləqdir" }]}
                    >
                        <Input placeholder="Tədbir başlığı..." />
                    </Form.Item>

                    <Form.Item
                        label="Təsvir"
                        name="description"
                        rules={[{ required: true, message: "Təsvir mütləqdir" }]}
                    >
                        <Input.TextArea rows={3} placeholder="Tədbir haqqında məlumat..." />
                    </Form.Item>

                    <div className="two-columns">
                        <Form.Item
                            label="Başlama vaxtı"
                            name="start_time"
                            rules={[{ required: true, message: "Başlama vaxtı mütləqdir" }]}
                        >
                            <DatePicker
                                showTime={{ format: "HH:mm" }}
                                format="YYYY-MM-DD HH:mm"
                                style={{ width: "100%" }}
                            />
                        </Form.Item>

                        <Form.Item
                            label="Bitmə vaxtı"
                            name="end_time"
                            rules={[{ required: true, message: "Bitmə vaxtı mütləqdir" }]}
                        >
                            <DatePicker
                                showTime={{ format: "HH:mm" }}
                                format="YYYY-MM-DD HH:mm"
                                style={{ width: "100%" }}
                            />
                        </Form.Item>
                    </div>

                    <Form.Item
                        label="Maksimum istifadəçi sayı"
                        name="max_user_count"
                        rules={[{ required: true, message: "Bu sahə mütləqdir" }]}
                    >
                        <InputNumber min={1} style={{ width: "100%" }} />
                    </Form.Item>

                    <Form.Item
                        label="Status"
                        name="status"
                        rules={[{ required: true, message: "Status seçilməlidir" }]}
                    >
                        <Select>
                            <Option value={1}>Gözləmədə</Option>
                            <Option value={2}>Aktiv</Option>
                            <Option value={3}>Bitib</Option>
                        </Select>
                    </Form.Item>

                    <Form.Item label="Şəkil (istəyə bağlı)">
                        <Upload
                            beforeUpload={() => false}
                            showUploadList={false}
                            onChange={handleFileChange}
                            accept="image/*"
                        >
                            <Button icon={<UploadOutlined />}>Yeni şəkil seç</Button>
                        </Upload>

                        {preview && (
                            <img
                                src={preview}
                                alt="preview"
                                style={{
                                    marginTop: "10px",
                                    maxWidth: "250px",
                                    borderRadius: "8px",
                                }}
                            />
                        )}
                    </Form.Item>

                    <Form.Item>
                        <Button
                            type="primary"
                            htmlType="submit"
                            loading={status === "loading"}
                            style={{ width: "100%" }}
                        >
                            {status === "loading" ? "Yenilənir..." : "Tədbiri Güncəllə"}
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        </div>
    );
};

export default MeetingEdit;
