import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { Button, Card, Table, Tag, Spin, Image } from "antd";
import { toast, Toaster } from "react-hot-toast";
import {
  PlayCircleOutlined,
  PauseCircleOutlined,
  ReloadOutlined,
  EditOutlined,
} from "@ant-design/icons";
import { useSelector } from "react-redux";
import "./MeetingDetail.scss";
const MeetingDetail = () => {
  const { id } = useParams();
  const token = useSelector((state) => state.auth.token);
  const [meeting, setMeeting] = useState(null);
  const [loading, setLoading] = useState(true);
  const [statusLoading, setStatusLoading] = useState(false);
  const API_URL = process.env.REACT_APP_API_URL;
  // bura yenidən bax !!!
  useEffect(() => {
    const fetchMeeting = async () => {
      try {
        const res = await axios.get(`${API_URL}/meetings/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMeeting(res.data.data);
        console.log(res.data.data);
      } catch (err) {
        console.error(err);
        toast.error("Tədbir yüklənə bilmədi.");
      } finally {
        setLoading(false);
      }
    };
    fetchMeeting();
  }, [id, API_URL, token]);
  const columns = [
    { title: "Atribut", dataIndex: "attr", key: "attr" },
    { title: "Dəyər", dataIndex: "value", key: "value" },
  ];

  if (loading)
    return (
      <div className="meeting-detail loading">
        <Spin size="large" />
      </div>
    );

  if (!meeting)
    return <div className="meeting-detail error">Tədbir tapılmadı.</div>;

  const statusColors = {
    1: "orange", // Upcoming
    2: "green",  // Active
    3: "volcano" // Finished
  };

  const statusText = {
    1: "Upcoming",
    2: "Active",
    3: "Finished"
  };

  const data = [
    { key: "1", attr: "Başlıq", value: meeting.title },
    { key: "2", attr: "Təsvir", value: meeting.description },
    { key: "3", attr: "Başlama vaxtı", value: meeting.start_time },
    { key: "4", attr: "Bitmə vaxtı", value: meeting.end_time },
    { key: "5", attr: "Max istifadəçi sayı", value: meeting.max_user_count },
    {
      key: "6",
      attr: "Status",
      value: <Tag color={statusColors[meeting.status]}>{statusText[meeting.status]}</Tag>,
    },
    {
      key: "7",
      attr: "Şəkil",
      value: meeting.image ? <Image src={meeting.image} width={200} /> : "Yoxdur",
    },
  ];

  return (
    <div className="meeting-detail">
      <Toaster position="top-right" />
      <Card className="meeting-card" title={`Tədbir: ${meeting.title}`}>
        <Table
          columns={columns}
          dataSource={data}
          pagination={false}
          className="meeting-table"
          showHeader={false}
        />

        <div className="actions">
          <Link to={`/meetings/edit/${meeting.id}`}>
            <Button icon={<EditOutlined />} className="edit-btn">
              Edit
            </Button>
          </Link>
        </div>
      </Card>
    </div>
  );
};

export default MeetingDetail;
