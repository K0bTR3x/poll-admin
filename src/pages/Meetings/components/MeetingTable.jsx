// src/pages/Meetings/components/MeetingTable.jsx
import React from "react";
import { Table, Space, Button, Tag } from "antd";
import { FiEdit, FiTrash2, FiEye } from "react-icons/fi";
import { BsQuestionSquare } from "react-icons/bs";
import { useNavigate } from "react-router-dom";

const MeetingTable = ({
    meetings,
    meta,
    loading,
    pagination,
    setPagination,
    onDelete,
    sortableList = [],
    filterableList = [],
}) => {
    const navigate = useNavigate();

    // ✅ Dinamik column generator
    const getColumns = () => {
        const cols = [
            {
                title: "ID",
                dataIndex: "id",
                key: "id",
                sorter: sortableList.includes("id")
                    ? (a, b) => a.id - b.id
                    : false,
                ...(filterableList.includes("id")
                    ? {
                        filters: meetings.map((m) => ({
                            text: m.id.toString(),
                            value: m.id,
                        })),
                        onFilter: (value, record) => record.id === value,
                    }
                    : {}),
            },
            {
                title: "Adı",
                dataIndex: "title",
                key: "title",
                sorter: sortableList.includes("title")
                    ? (a, b) => a.title.localeCompare(b.title)
                    : false,
                ...(filterableList.includes("title")
                    ? {
                        filters: [...new Set(meetings.map((m) => m.title))].map((t) => ({
                            text: t,
                            value: t,
                        })),
                        onFilter: (value, record) => record.title === value,
                    }
                    : {}),
            },
            {
                title: "Başlama vaxtı",
                dataIndex: "start_time",
                key: "start_time",
                sorter: sortableList.includes("start_time")
                    ? (a, b) => new Date(a.start_time) - new Date(b.start_time)
                    : false,
            },
            {
                title: "Bitmə vaxtı",
                dataIndex: "end_time",
                key: "end_time",
                sorter: sortableList.includes("end_time")
                    ? (a, b) => new Date(a.end_time) - new Date(b.end_time)
                    : false,
            },
            {
                title: "Status",
                dataIndex: "status",
                key: "status",
                sorter: sortableList.includes("status")
                    ? (a, b) => a.status - b.status
                    : false,
                ...(filterableList.includes("status")
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
                            onClick={() => onDelete(record.id, record.title)}
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

        return cols;
    };

    return (
        <Table
            columns={getColumns()}
            dataSource={meetings}
            loading={loading}
            rowKey="id"
            pagination={{
                current: meta?.current_page || pagination.currentPage,
                total: meta?.total || 0,
                pageSize: pagination.perPage,
                onChange: (page) =>
                    setPagination((prev) => ({ ...prev, currentPage: page })),
                showSizeChanger: false,
            }}
            scroll={{ x: "max-content" }}
        />
    );
};

export default MeetingTable;
