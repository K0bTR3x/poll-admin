import React, { useState, useEffect, useRef } from "react";
import { Table, Input, Button, Space, Tag, Select, Row, Col } from "antd";
import {
  FiEdit,
  FiTrash2,
  FiEye,
  FiPlus,
  FiSearch,
  FiFilter,
} from "react-icons/fi";
import { BsQuestionSquare } from "react-icons/bs";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import toast, { Toaster } from "react-hot-toast";
import api from "../../services/api";
import "./Meetings.scss";
const { Option } = Select;
const Meetings = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [meta, setMeta] = useState(null);
  const [sortableList, setsortableList] = useState([]);
  const [sortableFields, setSortableFields] = useState({
    sort: "id",
    sort_type: "asc",
  });
  const [setupFilters, setSetupFilters] = useState([]);
  const [perPage, setPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const searchInput = useRef(null);
  const navigate = useNavigate();
  // bura yenidən bax !!!
  const fetchEvents = async () => {
    try {
      setLoading(true);
      const res = await api.get(
        `/meetings?page=${currentPage}&perPage=${perPage}&sort=${sortableFields.sort}&sort_type=${sortableFields.sort_type}`
      );
      const { data, meta, sortable, filters } = res.data;
      setEvents(data);
      setMeta(meta);
      setsortableList(sortable || []);
      setSetupFilters(filters || []);
    } catch (err) {
      console.error("Tədbirlər yüklənmədi:", err);
      if (err.response?.status === 401) {
        toast.error("Sessiya başa çatdı. Yenidən daxil olun.");
        navigate("/");
      } else {
        toast.error("Tədbirləri yükləmək mümkün olmadı!");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [currentPage, perPage, sortableFields]);
  // ✅ Tədbir silmək
  const handleDelete = async (id) => {
    const event = events.find((e) => e.id === id);
    const confirm = await Swal.fire({
      title: "Silinsin?",
      text: `"${event?.title}" tədbirini silmək istədiyinizə əminsiniz?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Bəli, sil!",
      cancelButtonText: "Ləğv et",
    });

    if (confirm.isConfirmed) {
      try {
        await api.delete(`/meetings/${id}`);
        setEvents((prev) => prev.filter((e) => e.id !== id));
        toast.success(`"${event?.title}" silindi.`);
        setCurrentPage(1);
      } catch (err) {
        console.error(err);
        toast.error("Silmə zamanı xəta baş verdi!");
      }
    }
  };

  const getColumnSearchProps = (dataIndex, title) => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
      <div style={{ padding: 8 }}>
        <Input
          ref={searchInput}
          placeholder={`${title} üzrə axtar...`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{ marginBottom: 8, display: "block" }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<FiSearch />}
            size="small"
          >
            Axtar
          </Button>
          <Button onClick={() => handleReset(clearFilters)} size="small">
            Təmizlə
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <FiFilter
        style={{ color: filtered ? "var(--color-primary)" : undefined }}
      />
    ),
    filterDropdownProps: {
      onOpenChange: (open) => {
        if (open) setTimeout(() => searchInput.current?.select(), 100);
      },
    },
    render: (text) =>
      searchedColumn === dataIndex ? (
        <span style={{ backgroundColor: "#ffc069", padding: 2 }}>{text}</span>
      ) : (
        text
      ),
  });

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleTableChange = (pagination, filters, sorter) => {
    setSortableFields({
      sort: sorter.field || "id",
      sort_type:
        sorter.order === "ascend"
          ? "asc"
          : sorter.order === "descend"
            ? "desc"
            : "asc",
    });
  };

  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText("");
  };

  const columns = [
    {
      title: "Adı",
      dataIndex: "title",
      key: "title",
      sorter: sortableList.includes("title")
        ? (a, b) => a.title.localeCompare(b.title)
        : false,
      ...(setupFilters.includes("title")
        ? getColumnSearchProps("title", "Adı")
        : {}),
    },
    {
      title: "Başlama vaxtı",
      dataIndex: "start_time",
      key: "start_time",
      sorter: sortableList.includes("created_at")
        ? (a, b) => new Date(a.start_time) - new Date(b.start_time)
        : false,
    },
    {
      title: "Bitmə vaxtı",
      dataIndex: "end_time",
      key: "end_time",
      sorter: sortableList.includes("created_at")
        ? (a, b) => new Date(a.end_time) - new Date(b.end_time)
        : false,
    },
    {
      title: "Max istifadəçi sayı",
      dataIndex: "max_user_count",
      key: "max_user_count",
      sorter: sortableList.includes("max_user_count")
        ? (a, b) => a.max_user_count - b.max_user_count
        : false,
      ...(setupFilters.includes("max_user_count")
        ? getColumnSearchProps("max_user_count", "Max istifadəçi sayı")
        : {}),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      ...(setupFilters.includes("status")
        ? {
          filters: [
            { text: "Gözləmədə", value: 1 },
            { text: "Aktiv", value: 2 },
            { text: "Bitib", value: 3 },
          ],
          onFilter: (value, record) => record.status === value,
        }
        : {}),
      render: (status) => {
        let color =
          status === 1 ? "orange" : status === 2 ? "green" : "volcano";
        let text =
          status === 1 ? "Gözləmədə" : status === 2 ? "Aktiv" : "Bitib";
        return <Tag color={color}>{text}</Tag>;
      },
    },
    {
      title: "Əməliyyatlar",
      key: "actions",
      render: (_, record) => (
        <Space size="middle">
          <Button
            type="default"
            icon={<FiEye />}
            onClick={() => navigate(`/meetings/${record.id}`)}
          />
          <Button
            type="primary"
            icon={<FiEdit />}
            onClick={() => navigate(`/meetings/edit/${record.id}`)}
          />
          <Button
            danger
            icon={<FiTrash2 />}
            onClick={() => handleDelete(record.id)}
          />
          <Button
            type="default"
            icon={<BsQuestionSquare />}
            onClick={() => navigate(`/meetings/${record.id}/questions`)}
          />
        </Space>
      ),
    },
  ];
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };
  return (
    <div className="events-page">
      <Toaster position="top-right" />
      <div className="events-header">
        <Row gutter={[16, 16]} align="middle" justify="space-between">
          <Col>
            <span className="breadcrumb">İdarəetmə Paneli / Tədbirlər</span>
          </Col>
          <Col>
            <Space>
              <Select
                defaultValue={perPage}
                style={{ width: 120 }}
                onChange={(value) => setPerPage(value)}
              >
                {[5, 10, 15, 20, 30, 50].map((size) => (
                  <Option key={size} value={size}>
                    {size} / səhifə
                  </Option>
                ))}
              </Select>

              <Link to="/meetings/create">
                <Button type="primary" icon={<FiPlus />}>
                  Yeni Tədbir
                </Button>
              </Link>
            </Space>
          </Col>
        </Row>
      </div>
      <Table
        columns={columns}
        dataSource={events}
        loading={loading}
        onChange={handleTableChange}
        rowKey="id"
        pagination={{
          current: meta?.current_page || currentPage,
          total: meta?.total || 0,
          pageSize: perPage,
          onChange: handlePageChange,
          showSizeChanger: false,
        }}
        scroll={{ x: "max-content" }}
      />
    </div>
  );
};

export default Meetings;
