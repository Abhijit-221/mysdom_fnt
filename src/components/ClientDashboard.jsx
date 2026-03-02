import React from "react";
import "./clientDashboard.css";

const ClientDashboard = () => {
  return (
    <section className="dashboard">
      <div className="dashboard-container">
        {/* Header */}
        <div className="dashboard-header">
          <span className="tag">CLIENT DASHBOARD</span>
          <h2>Trusted by India's Leading Enterprises</h2>
          <p>
            Real-time verification insights and analytics for our enterprise clients
          </p>
        </div>

        {/* Top Stats */}
        <div className="stats-grid">
          <div className="stat-box">
            <p>Total Verifications This Month</p>
            <h3>8,456</h3>
            <span className="positive">↑ +12.5%</span>
          </div>

          <div className="stat-box">
            <p>Pending Verifications</p>
            <h3>1,508</h3>
            <span className="negative">↓ -5.2%</span>
          </div>

          <div className="stat-box">
            <p>Average TAT</p>
            <h3>3.2 Days</h3>
            <span className="negative">↓ -0.3 days</span>
          </div>

          <div className="stat-box">
            <p>Client Satisfaction</p>
            <h3>98.7%</h3>
            <span className="positive">↑ +2.1%</span>
          </div>
        </div>

        {/* Table Section */}
        <div className="table-card">
          <div className="table-header">
            Enterprise Client Overview
          </div>

          <table>
            <thead>
              <tr>
                <th>Client Name</th>
                <th>Completed</th>
                <th>Pending</th>
                <th>Avg TAT</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>TATA Group</td>
                <td>15,420</td>
                <td>234</td>
                <td>3.2 days</td>
                <td><span className="status active">Active</span></td>
              </tr>
              <tr>
                <td>Adani Group</td>
                <td>12,850</td>
                <td>187</td>
                <td>3.5 days</td>
                <td><span className="status active">Active</span></td>
              </tr>
              <tr>
                <td>Infosys</td>
                <td>22,340</td>
                <td>412</td>
                <td>2.9 days</td>
                <td><span className="status active">Active</span></td>
              </tr>
              <tr>
                <td>Reliance Industries</td>
                <td>14,560</td>
                <td>221</td>
                <td>3.4 days</td>
                <td><span className="status active">Active</span></td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Bottom Summary Cards */}
        <div className="bottom-cards">
          <div className="bottom-card green">
            <p>Total Verifications</p>
            <h3>93,880</h3>
          </div>

          <div className="bottom-card pink">
            <p>Active Clients</p>
            <h3>6</h3>
          </div>

          <div className="bottom-card purple">
            <p>Overall TAT</p>
            <h3>3.2 Days</h3>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ClientDashboard;