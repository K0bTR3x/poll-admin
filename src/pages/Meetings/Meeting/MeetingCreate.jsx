import React, { useState } from "react";
import { Form, Input, DatePicker, TimePicker, Select, Button, InputNumber } from "antd";
import axios from "axios";
import { toast, Toaster } from "react-hot-toast";
import { useSelector } from "react-redux";
import "./MeetingCreate.scss";

const { Option } = Select;

const MeetingCreate = () => {
  const token = useSelector((state) => state.auth.token); // Redux token
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [form] = Form.useForm();

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (values) => {
    if (!imageFile) {
      toast.error("Şəkil mütləqdir!");
      return;
    }

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("title", values.title);
      formData.append("description", values.description);
      formData.append("start_time", values.startTime.format("YYYY-MM-DD HH:mm"));
      formData.append("end_time", values.endTime.format("YYYY-MM-DD HH:mm"));
      formData.append("status", values.status);
      formData.append("max_user_count", values.maxUserCount);
      formData.append("image", imageFile);

      await axios.post(`${process.env.REACT_APP_API_URL}/meetings`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("Tədbir uğurla yaradıldı!");
      form.resetFields();
      setImageFile(null);
      setPreview(null);
    } catch (err) {
      console.error(err);
      toast.error("Xəta baş verdi. Tədbir yaradıla bilmədi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-event">
      <Toaster position="top-right" />
      <div className="form-container">
        <h2>Tədbir Yarat</h2>
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{ status: "1" }}
        >
          {/* Başlıq və Təsvirdə */}
          <Form.Item
            label="Başlıq"
            name="title"
            rules={[{ required: true, message: "Başlıq mütləqdir" }]}
          >
            <Input placeholder="Tədbirin adı" />
          </Form.Item>

          <Form.Item
            label="Təsvir"
            name="description"
            rules={[{ required: true, message: "Təsvir mütləqdir" }]}
          >
            <Input.TextArea rows={3} placeholder="Tədbir haqqında" />
          </Form.Item>

          {/* Tarix və Saat */}
          <div className="two-columns">
            <Form.Item
              label="Başlama vaxtı"
              name="startTime"
              rules={[{ required: true, message: "Başlama vaxtı mütləqdir" }]}
            >
              <DatePicker showTime style={{ width: "100%" }} />
            </Form.Item>

            <Form.Item
              label="Bitmə vaxtı"
              name="endTime"
              rules={[{ required: true, message: "Bitmə vaxtı mütləqdir" }]}
            >
              <DatePicker showTime style={{ width: "100%" }} />
            </Form.Item>
          </div>

          {/* Max istifadəçi sayı */}
          <Form.Item
            label="Max istifadəçi sayı"
            name="maxUserCount"
            rules={[{ required: true, message: "Max istifadəçi sayı mütləqdir" }]}
          >
            <InputNumber min={1} style={{ width: "100%" }} />
          </Form.Item>

          {/* Status */}
          <Form.Item
            label="Status"
            name="status"
            rules={[{ required: true, message: "Status seçilməlidir" }]}
          >
            <Select>
              <Option value={1}>Upcoming</Option>
              <Option value={2}>Active</Option>
              <Option value={3}>Finished</Option>
            </Select>
          </Form.Item>

          {/* Şəkil upload */}
          <Form.Item
            label="Şəkil"
            rules={[{ required: true, message: "Şəkil mütləqdir!" }]}
          >
            <input type="file" accept="image/*" onChange={handleFileChange} />
            {preview && (
              <img
                src={preview}
                alt="preview"
                style={{ marginTop: "10px", maxWidth: "200px", borderRadius: "6px" }}
              />
            )}
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

export default MeetingCreate;
