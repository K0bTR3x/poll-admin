import React, { useState, useEffect } from "react";
import { Form, Input, DatePicker, TimePicker, Select, Button } from "antd";
import moment from "moment";
import axios from "axios";
import { toast, Toaster } from "react-hot-toast";
import { useParams, useNavigate } from "react-router-dom";
import "./EventEdit.scss";

const { Option } = Select;

const EventEdit = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [form] = Form.useForm();

    useEffect(() => {
        const fetchEvent = async () => {
            try {
                const res = await axios.get(`${process.env.REACT_APP_API_URL}/events/${id}`);
                const event = res.data;

                form.setFieldsValue({
                    title: event.title,
                    eventDate: moment(event.date),
                    startTime: moment(event.startTime, "HH:mm"),
                    endTime: moment(event.endTime, "HH:mm"),
                    status: event.status,
                });
            } catch (err) {
                toast.error("Event yüklənə bilmədi.");
            }
        };
        fetchEvent();
    }, [id, form]);

    const handleSubmit = async (values) => {
        try {
            setLoading(true);
            const payload = {
                title: values.title,
                date: values.eventDate.format("YYYY-MM-DD"),
                startTime: values.startTime.format("HH:mm"),
                endTime: values.endTime.format("HH:mm"),
                status: values.status,
            };

            await axios.put(`${process.env.REACT_APP_API_URL}/events/${id}`, payload);
            toast.success("Tədbir uğurla güncəlləndi!");
            navigate("/events");
        } catch (err) {
            console.error(err);
            toast.error("Xəta baş verdi. Tədbir güncəllənmədi.");
        } finally {
            setLoading(false);
        }
    };

    const validateTime = ({ getFieldValue }) => ({
        validator(_, value) {
            const startTime = getFieldValue("startTime");
            if (!value || !startTime) return Promise.resolve();
            if (value.isAfter(startTime)) return Promise.resolve();
            return Promise.reject(new Error("Bitmə vaxtı başlanğıc vaxtından sonra olmalıdır"));
        },
    });

    return (
        <div className="create-event">
            <Toaster position="top-right" />
            <div className="form-container">
                <h2>Tədbiri Güncəllə</h2>
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleSubmit}
                >
                    <Form.Item label="Başlıq" name="title" rules={[{ required: true, message: "Başlıq mütləqdir" }]}>
                        <Input placeholder="Tədbirin adı" />
                    </Form.Item>

                    <Form.Item label="Tədbirin tarixi" name="eventDate" rules={[{ required: true, message: "Tədbirin tarixi mütləqdir" }]}>
                        <DatePicker style={{ width: "100%" }} />
                    </Form.Item>

                    <div className="two-columns">
                        <Form.Item label="Başlama vaxtı" name="startTime" rules={[{ required: true, message: "Başlama vaxtı mütləqdir" }]}>
                            <TimePicker style={{ width: "100%" }} format="HH:mm" />
                        </Form.Item>

                        <Form.Item label="Bitmə vaxtı" name="endTime" dependencies={["startTime"]} rules={[{ required: true, message: "Bitmə vaxtı mütləqdir" }, validateTime]}>
                            <TimePicker style={{ width: "100%" }} format="HH:mm" />
                        </Form.Item>
                    </div>

                    <Form.Item label="Status" name="status" rules={[{ required: true, message: "Status seçilməlidir" }]}>
                        <Select>
                            <Option value="upcoming">Upcoming</Option>
                            <Option value="active">Active</Option>
                            <Option value="finished">Finished</Option>
                        </Select>
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit" loading={loading}>
                            {loading ? "Güncəllənir..." : "Tədbiri Güncəllə"}
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        </div>
    );
};

export default EventEdit;
