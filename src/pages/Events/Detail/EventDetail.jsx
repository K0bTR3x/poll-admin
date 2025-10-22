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
import "./EventDetail.scss";

const EventDetail = () => {
  const { id } = useParams();
  const token = useSelector((state) => state.auth.token);
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [statusLoading, setStatusLoading] = useState(false);
  const API_URL = process.env.REACT_APP_API_URL;
  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await axios.get(`${API_URL}/meetings/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setEvent(res.data.data);
        console.log(res.data.data);
      } catch (err) {
        console.error(err);
        toast.error("Tədbir yüklənə bilmədi.");
      } finally {
        setLoading(false);
      }
    };
    fetchEvent();
  }, [id, API_URL, token]);

  const handleStatusToggle = async () => {
    if (!event) return;

    let newStatus = "";
    if (event.status === 1) newStatus = 2;
    else if (event.status === 2) newStatus = 1;

    setStatusLoading(true);

    try {
      const res = await axios.patch(
        `${API_URL}/meetings/${id}`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setEvent(res.data);
      toast.success(`Status dəyişdirildi!`);
    } catch (err) {
      console.error(err);
      toast.error("Status dəyişdirilə bilmədi.");
    } finally {
      setStatusLoading(false);
    }
  };

  const getButtonConfig = () => {
    if (!event) return {};
    switch (event.status) {
      case 1:
        return { text: "Start", icon: <PlayCircleOutlined />, className: "start" };
      case 2:
        return { text: "Pause", icon: <PauseCircleOutlined />, className: "pause" };
      case 3:
        return { text: "Finished", className: "finished" };
      default:
        return {};
    }
  };

  const columns = [
    { title: "Atribut", dataIndex: "attr", key: "attr" },
    { title: "Dəyər", dataIndex: "value", key: "value" },
  ];

  if (loading)
    return (
      <div className="event-detail loading">
        <Spin size="large" />
      </div>
    );

  if (!event)
    return <div className="event-detail error">Tədbir tapılmadı.</div>;

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
    { key: "1", attr: "Başlıq", value: event.title },
    { key: "2", attr: "Təsvir", value: event.description },
    { key: "3", attr: "Başlama vaxtı", value: event.start_time },
    { key: "4", attr: "Bitmə vaxtı", value: event.end_time },
    { key: "5", attr: "Max istifadəçi sayı", value: event.max_user_count },
    {
      key: "6",
      attr: "Status",
      value: <Tag color={statusColors[event.status]}>{statusText[event.status]}</Tag>,
    },
    {
      key: "7",
      attr: "Şəkil",
      value: event.image ? <Image src={event.image} width={200} /> : "Yoxdur",
    },
  ];

  const btn = getButtonConfig();
  const isDisabled = event.status === 3;

  return (
    <div className="event-detail">
      <Toaster position="top-right" />
      <Card className="event-card" title={`Tədbir: ${event.title}`}>
        <Table
          columns={columns}
          dataSource={data}
          pagination={false}
          className="event-table"
          showHeader={false}
        />

        <div className="actions">
          <Button
            type="primary"
            icon={btn.icon}
            className={`status-btn ${btn.className}`}
            onClick={handleStatusToggle}
            loading={statusLoading}
            disabled={isDisabled}
          >
            {btn.text}
          </Button>

          <Link to={`/events/edit/${event.id}`}>
            <Button icon={<EditOutlined />} className="edit-btn">
              Edit
            </Button>
          </Link>
        </div>
      </Card>
    </div>
  );
};

export default EventDetail;
