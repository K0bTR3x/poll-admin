import React, { useState } from "react";
import {
  Form,
  Input,
  DatePicker,
  Select,
  Button,
  InputNumber,
  Upload,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { toast, Toaster } from "react-hot-toast";
import { useSelector, useDispatch } from "react-redux";
import dayjs from "dayjs";
import { createMeeting } from "../../../store/slices/meetingSlice/meetingSlice";
import "./MeetingCreate.scss";

const { Option } = Select;

const MeetingCreate = () => {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);
  const status = useSelector((state) => state.meetings.status);
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [form] = Form.useForm();

  const handleFileChange = (info) => {
    const file = info.file.originFileObj || info.file; // hər iki halda tut
    if (file) {
      setImageFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  // 🔹 Submit
  const handleSubmit = async (values) => {
    if (!imageFile) {
      toast.error("Şəkil mütləqdir!");
      return;
    }

    const formData = new FormData();
    formData.append("title", values.title);
    formData.append("description", values.description);
    formData.append("start_time", dayjs(values.start_time).format("YYYY-MM-DD HH:mm"));
    formData.append("end_time", dayjs(values.end_time).format("YYYY-MM-DD HH:mm"));
    formData.append("status", values.status);
    formData.append("max_user_count", values.max_user_count);
    formData.append("image", imageFile);

    dispatch(createMeeting({ formData, token }))
      .unwrap()
      .then(() => {
        toast.success("Meeting uğurla yaradıldı!");
        form.resetFields();
        setImageFile(null);
        setPreview(null);
      })
      .catch((err) => {
        toast.error(err || "Meeting yaradılarkən xəta baş verdi!");
      });
  };

  const loading = status === "loading";

  return (
    <div className="meeting-create-page">
      <Toaster position="top-right" />
      <div className="form-container">
        <h2>Yeni Tədbir Yarat</h2>

        <Form
          layout="vertical"
          form={form}
          onFinish={handleSubmit}
          initialValues={{
            status: 1,
            max_user_count: 100,
          }}
        >
          {/* Başlıq */}
          <Form.Item
            label="Başlıq"
            name="title"
            rules={[{ required: true, message: "Başlıq mütləqdir" }]}
          >
            <Input placeholder="Meeting başlığı..." />
          </Form.Item>

          {/* Təsvir */}
          <Form.Item
            label="Təsvir"
            name="description"
            rules={[{ required: true, message: "Təsvir mütləqdir" }]}
          >
            <Input.TextArea rows={3} placeholder="Meeting haqqında məlumat..." />
          </Form.Item>

          {/* Tarixlər */}
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

          {/* Max istifadəçi sayı */}
          <Form.Item
            label="Maksimum istifadəçi sayı"
            name="max_user_count"
            rules={[{ required: true, message: "Bu sahə mütləqdir" }]}
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
              <Option value={1}>Gözləmədə</Option>
              <Option value={2}>Aktiv</Option>
              <Option value={3}>Bitib</Option>
            </Select>
          </Form.Item>

          {/* Şəkil yükləmə */}
          <Form.Item
            label="Şəkil"
            rules={[{ required: true, message: "Şəkil seçilməlidir!" }]}
          >
            <Upload
              beforeUpload={() => false}
              showUploadList={false}
              onChange={handleFileChange}
              accept="image/*"
            >
              <Button icon={<UploadOutlined />}>Şəkil seç</Button>
            </Upload>


            {preview && (
              <div className="image-preview">
                <img src={preview} alt="preview" className="preview-img" />
                <Button
                  danger
                  size="small"
                  onClick={() => {
                    setPreview(null);
                    setImageFile(null);
                  }}
                >
                  Sil
                </Button>
              </div>
            )}

          </Form.Item>

          {/* Submit düyməsi */}
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              style={{ width: "100%" }}
            >
              {loading ? "Yaradılır..." : "Meeting Yarat"}
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default MeetingCreate;
