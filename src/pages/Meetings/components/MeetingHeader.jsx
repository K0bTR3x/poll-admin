// src/pages/Meetings/components/MeetingHeader.jsx
import React from "react";
import { Button, Select, Row, Col, Space } from "antd";
import { FiPlus } from "react-icons/fi";
import { Link } from "react-router-dom";

const { Option } = Select;

const MeetingHeader = ({ pagination, setPagination }) => {
    return (
        <div className="meetings-header">
            <Row>
                <Col>
                    <span className="breadcrumb">İdarəetmə Paneli / Tədbirlər Siyahısı</span>
                </Col>
                <Col>
                    <Space>
                        <Select
                            defaultValue={pagination.perPage}
                            style={{ width: 120 }}
                            onChange={(value) =>
                                setPagination((prev) => ({ ...prev, perPage: value }))
                            }
                        >
                            {[5, 10, 15, 20, 30, 50].map((size) => (
                                <Option key={size} value={size}>
                                    {size} / səhifə
                                </Option>
                            ))}
                        </Select>

                        <Link to="/meetings/create">
                            <Button type="primary" icon={<FiPlus />}>
                                əlavə et
                            </Button>
                        </Link>
                    </Space>
                </Col>
            </Row>
        </div>
    );
};

export default MeetingHeader;
