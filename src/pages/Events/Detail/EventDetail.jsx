import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { Button, Card, Table, Tag, Spin } from "antd";
import { toast, Toaster } from "react-hot-toast";
import {
  PlayCircleOutlined,
  PauseCircleOutlined,
  ReloadOutlined,
  EditOutlined,
} from "@ant-design/icons";
import "./EventDetail.scss";

const EventDetail = () => {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [statusLoading, setStatusLoading] = useState(false);
  const API_URL = process.env.REACT_APP_API_URL;

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await axios.get(`${API_URL}/events/${id}`);
        setEvent(res.data);
      } catch (err) {
        toast.error("Tədbir yüklənə bilmədi.");
      } finally {
        setLoading(false);
      }
    };
    fetchEvent();
  }, [id, API_URL]);

  const handleStatusToggle = async () => {
    if (!event) return;

    let newStatus = "";
    if (event.status === "upcoming") newStatus = "active";
    else if (event.status === "active") newStatus = "paused";
    else if (event.status === "paused") newStatus = "active";

    setStatusLoading(true);

    try {
      const res = await axios.patch(`${API_URL}/events/${id}`, { status: newStatus });
      setEvent(res.data);
      toast.success(`Status "${newStatus}" oldu!`);
    } catch (err) {
      toast.error("Status dəyişdirilə bilmədi.");
    } finally {
      setStatusLoading(false);
    }
  };

  const getButtonConfig = () => {
    if (!event) return {};
    switch (event.status) {
      case "upcoming":
        return { text: "Start", icon: <PlayCircleOutlined />, className: "start" };
      case "active":
        return { text: "Pause", icon: <PauseCircleOutlined />, className: "pause" };
      case "paused":
        return { text: "Resume", icon: <ReloadOutlined />, className: "resume" };
      case "finished":
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
    return (
      <div className="event-detail error">
        Tədbir tapılmadı.
      </div>
    );

  const data = [
    { key: "1", attr: "Başlıq", value: event.title },
    { key: "2", attr: "Tarix", value: new Date(event.date).toLocaleDateString() },
    { key: "3", attr: "Başlama vaxtı", value: event.startTime },
    { key: "4", attr: "Bitmə vaxtı", value: event.endTime },
    {
      key: "5",
      attr: "Status",
      value: (
        <Tag
          color={
            event.status === "active"
              ? "green"
              : event.status === "paused"
                ? "orange"
                : event.status === "finished"
                  ? "red"
                  : "blue"
          }
        >
          {event.status.toUpperCase()}
        </Tag>
      ),
    },
  ];

  const btn = getButtonConfig();
  const isDisabled = event.status === "finished";

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
