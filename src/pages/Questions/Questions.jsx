import React, { useEffect, useState, useRef } from "react";
import { Table, Button, Space, Tag, Input, Select, Row, Col } from "antd";
import { FiEdit, FiTrash2, FiPlus, FiFilter, FiSearch, FiList } from "react-icons/fi";
import { Link, useParams, useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import Swal from "sweetalert2";
import api from "../../services/api";
import "./Questions.scss";

const { Option } = Select;

const Questions = () => {
    const { id: eventId } = useParams(); // gəlir /events/:id/questions
    const navigate = useNavigate();
    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [meta, setMeta] = useState(null);
    const [sortable, setSortable] = useState([]);
    const [filters, setFilters] = useState([]);
    const [sortableFields, setSortableFields] = useState({
        sort: "id",
        sort_type: "asc",
    });
    const [perPage, setPerPage] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
    const searchInput = useRef(null);
    const [searchText, setSearchText] = useState("");
    const [searchedColumn, setSearchedColumn] = useState("");

    const fetchQuestions = async () => {
        try {
            setLoading(true);
            const res = await api.get(
                `/questions?page=${currentPage}&perPage=${perPage}&sort=${sortableFields.sort}&sort_type=${sortableFields.sort_type}&meeting_id=${eventId}`
            );
            const { data, meta, sortable, filters } = res.data;
            setQuestions(data);
            setMeta(meta);
            setSortable(sortable || []);
            setFilters(filters || []);
        } catch (err) {
            console.error("Suallar yüklənmədi:", err);
            if (err.response?.status === 401) {
                toast.error("Sessiya bitdi, yenidən daxil olun.");
                navigate("/");
            } else {
                toast.error("Sualları yükləmək mümkün olmadı!");
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchQuestions();
    }, [currentPage, perPage, sortableFields]);

    const handleDelete = async (id) => {
        const confirm = await Swal.fire({
            title: "Sual silinsin?",
            text: "Bu sual silinəcək. Davam edilsin?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Bəli, sil",
            cancelButtonText: "Ləğv et",
        });

        if (confirm.isConfirmed) {
            try {
                await api.delete(`/questions/${id}`);
                setQuestions((prev) => prev.filter((q) => q.id !== id));
                toast.success("Sual silindi!");
            } catch (err) {
                console.error(err);
                toast.error("Silərkən xəta baş verdi!");
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
            <FiFilter style={{ color: filtered ? "var(--color-primary)" : undefined }} />
        ),
        onFilterDropdownOpenChange: (visible) => {
            if (visible) {
                setTimeout(() => searchInput.current?.select(), 100);
            }
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

    const handleReset = (clearFilters) => {
        clearFilters();
        setSearchText("");
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

    const columns = [
        {
            title: "Başlıq",
            dataIndex: "title",
            key: "title",
            sorter: sortable.includes("title")
                ? (a, b) => a.title.localeCompare(b.title)
                : false,
            ...(filters.includes("title")
                ? getColumnSearchProps("title", "Başlıq")
                : {}),
        },
        {
            title: "Alt başlıq",
            dataIndex: "subtitle",
            key: "subtitle",
        },
        {
            title: "Status",
            dataIndex: "status",
            key: "status",
            render: (status) => (
                <Tag color={status ? "green" : "volcano"}>
                    {status ? "Aktiv" : "Deaktiv"}
                </Tag>
            ),
        },
        {
            title: "Cavab tipi",
            dataIndex: "is_multi",
            key: "is_multi",
            render: (is_multi) => (
                <Tag color={is_multi ? "blue" : "purple"}>
                    {is_multi ? "Multi-choice" : "Radio"}
                </Tag>
            ),
        },
        {
            title: "Əməliyyatlar",
            key: "actions",
            render: (_, record) => (
                <Space>
                    <Button
                        type="default"
                        icon={<FiEdit />}
                        onClick={() =>
                            navigate(`/events/${eventId}/questions/edit/${record.id}`)
                        }
                    />
                    <Button
                        danger
                        icon={<FiTrash2 />}
                        onClick={() => handleDelete(record.id)}
                    />
                </Space>
            ),
        },
    ];

    return (
        <div className="questions-page">
            <Toaster position="top-right" />
            <div className="questions-header">
                <Row gutter={[16, 16]} align="middle" justify="space-between">
                    <Col>
                        <span className="breadcrumb">
                            İdarəetmə Paneli / Tədbirlər / Suallar
                        </span>
                    </Col>
                    <Col>
                        <Space>
                            <Select
                                defaultValue={perPage}
                                style={{ width: 120 }}
                                onChange={(v) => setPerPage(v)}
                            >
                                {[5, 10, 15, 20, 30, 50].map((size) => (
                                    <Option key={size} value={size}>
                                        {size} / səhifə
                                    </Option>
                                ))}
                            </Select>

                            <Button
                                type="primary"
                                icon={<FiPlus />}
                                onClick={() => navigate(`/events/${eventId}/questions/add`)}
                            >
                                Yeni sual
                            </Button>

                            <Button
                                icon={<FiList />}
                                onClick={() => navigate(`/events/${eventId}/questions/order`)}
                            >
                                Sıralama
                            </Button>
                        </Space>
                    </Col>
                </Row>
            </div>

            <Table
                columns={columns}
                dataSource={questions}
                loading={loading}
                onChange={handleTableChange}
                rowKey="id"
                pagination={{
                    current: meta?.current_page || currentPage,
                    total: meta?.total || 0,
                    pageSize: perPage,
                    onChange: (page) => setCurrentPage(page),
                    showSizeChanger: false,
                }}
                scroll={{ x: "max-content" }}
            />
        </div>
    );
};

export default Questions;
