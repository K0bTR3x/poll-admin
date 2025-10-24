// Dashboard.jsx
import React from "react";
import { Row, Col, Card, Statistic, Table } from "antd";
import { FiUsers, FiCalendar, FiActivity } from "react-icons/fi";
import { useSelector } from "react-redux";
import "./Dashboard.scss";
const Dashboard = () => {
    const { darkMode } = useSelector((state) => state.theme);
    const columns = [
        {
            title: 'Meeting Name',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Date',
            dataIndex: 'date',
            key: 'date',
        },
        {
            title: 'Participants',
            dataIndex: 'participants',
            key: 'participants',
        },
    ];
    const data = [
        { key: 1, name: "Annual Meetup", date: "2025-10-20", participants: 50 },
        { key: 2, name: "Workshop React", date: "2025-10-25", participants: 30 },
        { key: 3, name: "Design Sprint", date: "2025-10-28", participants: 40 },
    ];

    return (
        <div className={`dashboard-page ${darkMode ? "dark" : "light"}`}>
            <Row gutter={[16, 16]} className="stats-cards">
                <Col xs={24} sm={12} md={8}>
                    <Card>
                        <Statistic
                            title="Users"
                            value={1128}
                            prefix={<FiUsers />}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} md={8}>
                    <Card>
                        <Statistic
                            title="Meetings"
                            value={12}
                            prefix={<FiCalendar />}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} md={8}>
                    <Card>
                        <Statistic
                            title="Activities"
                            value={93}
                            prefix={<FiActivity />}
                        />
                    </Card>
                </Col>
            </Row>

            <Card className="meetings-table" style={{ marginTop: 20 }}>
                <Table
                    columns={columns}
                    dataSource={data}
                    pagination={false}
                    bordered
                    size="middle"
                />
            </Card>
        </div>
    );
};

export default Dashboard;
