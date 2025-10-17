// EventCreate.jsx
import React, { useState } from "react";
import { Form, Input, DatePicker, TimePicker, Select, Button } from "antd";
import moment from "moment";
import axios from "axios";
import { toast, Toaster } from "react-hot-toast";
import "./EventCreate.scss";

const { Option } = Select;

const EventCreate = () => {
  const [loading, setLoading] = useState(false);

  const [form] = Form.useForm();

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

      await axios.post(`${process.env.REACT_APP_API_URL}/events`, payload);
      toast.success("Tədbir uğurla yaradıldı!");
      form.resetFields();
    } catch (err) {
      console.error(err);
      toast.error("Xəta baş verdi. Tədbir yaradıla bilmədi.");
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
        <h2>Tədbir Yarat</h2>
        <Form form={form} layout="vertical" onFinish={handleSubmit} initialValues={{ status: "upcoming" }}>
          {/* Başlıq və Tədbirin tarixi */}
          <div className="two-columns">
            <Form.Item
              label="Başlıq"
              name="title"
              rules={[{ required: true, message: "Başlıq mütləqdir" }]}
            >
              <Input placeholder="Tədbirin adı" />
            </Form.Item>

            <Form.Item
              label="Tədbirin tarixi"
              name="eventDate"
              rules={[{ required: true, message: "Tədbirin tarixi mütləqdir" }]}
            >
              <DatePicker style={{ width: "100%" }} />
            </Form.Item>
          </div>

          {/* Başlama və Bitmə vaxtı */}
          <div className="two-columns">
            <Form.Item
              label="Başlama vaxtı"
              name="startTime"
              rules={[{ required: true, message: "Başlama vaxtı mütləqdir" }]}
            >
              <TimePicker style={{ width: "100%" }} format="HH:mm" />
            </Form.Item>

            <Form.Item
              label="Bitmə vaxtı"
              name="endTime"
              dependencies={["startTime"]}
              rules={[
                { required: true, message: "Bitmə vaxtı mütləqdir" },
                validateTime,
              ]}
            >
              <TimePicker style={{ width: "100%" }} format="HH:mm" />
            </Form.Item>
          </div>

          {/* Status */}
          <Form.Item
            label="Status"
            name="status"
            rules={[{ required: true, message: "Status seçilməlidir" }]}
          >
            <Select>
              <Option value="upcoming">Upcoming</Option>
              <Option value="active">Active</Option>
              <Option value="finished">Finished</Option>
            </Select>
          </Form.Item>

          {/* Submit */}
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading}>
              {loading ? "Yaradılır..." : "Tədbiri Yarat"}
            </Button>
          </Form.Item>
        </Form>

      </div>
    </div>
  );
};

export default EventCreate;
