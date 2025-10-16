import "./Dashboard.scss";
import Sidebar from "../../layout/sidebar/Sidebar";
import Header from "../../layout/header/Header";
const Dashboard = () => {
    return (
        <>
            <div className="main-content">
                <section className="stats-section">
                    <div className="stat-card">
                        <h3>İştirakçı sayı</h3>
                        <p>1200</p>
                    </div>
                    <div className="stat-card">
                        <h3>Tədbirlər sayı</h3>
                        <p>15</p>
                    </div>
                    <div className="stat-card">
                        <h3>Qeydiyyat</h3>
                        <p>340</p>
                    </div>
                </section>

                {/* Main graph placeholder */}
                <section className="chart-section">
                    <div className="chart-placeholder">[Grafik buraya gələcək]</div>
                </section>
            </div>
        </>
    );
};

export default Dashboard;
