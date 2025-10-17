// Events.jsx
import React, { useState, useEffect } from "react";
import { Table, Input, Button, Space, Tag } from "antd";
import { FiEdit, FiTrash2, FiEye, FiPlus } from "react-icons/fi";
import { BsQuestionSquare } from "react-icons/bs";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Events.scss";

const Events = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const API_URL = process.env.REACT_APP_API_URL;
  const navigate = useNavigate();
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await axios.get(`${API_URL}/events`);
        setEvents(res.data);
        setFilteredData(res.data);
        setLoading(false);
      } catch (err) {
        toast.error("Tədbirləri yükləmək mümkün olmadı!");
        setLoading(false);
      }
    };
    fetchEvents();
  }, [API_URL]);

  const handleDelete = (id) => {
    const event = events.find((e) => e.id === id);
    Swal.fire({
      title: "Silinsin?",
      text: `"${event.title}" tədbirini silmək istədiyinizə əminsiniz?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Bəli, sil!",
      cancelButtonText: "Ləğv et",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`${API_URL}/events/${id}`);
          const newData = events.filter((e) => e.id !== id);
          setEvents(newData);
          setFilteredData(newData);
          Swal.fire("Silindi!", `"${event.title}" silindi.`, "success");
        } catch (err) {
          Swal.fire("Xəta!", "Silmə zamanı problem baş verdi.", "error");
        }
      }
    });
  };

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchText(value);
    const filtered = events.filter((event) =>
      event.title.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredData(filtered);
  };

  const columns = [
    {
      title: "Adı",
      dataIndex: "title",
      key: "title",
      sorter: (a, b) => a.title.localeCompare(b.title),
      render: (text) => <span>{text}</span>,
    },
    {
      title: "Tarix",
      dataIndex: "date",
      key: "date",
      sorter: (a, b) => new Date(a.date) - new Date(b.date),
      render: (date) => new Date(date).toLocaleDateString(),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      filters: [
        { text: "active", value: "active" },
        { text: "upcoming", value: "upcoming" },
        { text: "finished", value: "finished" },
        { text: "paused", value: "paused" },
      ],
      onFilter: (value, record) => record.status === value,
      render: (status) => {
        let color = status === "active" ? "green" : "volcano";
        return <Tag color={color}>{status.toUpperCase()}</Tag>;
      },
    },
    {
      title: "Əməliyyatlar",
      key: "actions",
      render: (_, record) => (
        <Space size="middle">
          <Button type="default" icon={<FiEye />} onClick={() => navigate(`/events/${record.id}`)} />
          <Button type="primary" icon={<FiEdit />} onClick={() => navigate(`/events/edit/${record.id}`)} />
          <Button
            type="danger"
            icon={<FiTrash2 />}
            onClick={() => handleDelete(record.id)}
          />
          <Button type="default" icon={<BsQuestionSquare />} />
        </Space>
      ),
    },
  ];

  return (
    <div className="events-page">
      <Toaster position="top-right" />
      <div className="events-header" style={{ marginBottom: 16 }}>
        <Input
          placeholder="Axtar..."
          value={searchText}
          onChange={handleSearch}
          style={{ width: 200, marginRight: 16 }}
        />
        <Link to="/events/create">
          <Button type="primary" icon={<FiPlus />}>
            Yeni Tədbir
          </Button>
        </Link>
      </div>

      <Table
        columns={columns}
        dataSource={filteredData}
        loading={loading}
        rowKey="id"
        pagination={{ pageSize: 5 }}
        scroll={{ x: "max-content" }}
      />
    </div>
  );
};

export default Events;
