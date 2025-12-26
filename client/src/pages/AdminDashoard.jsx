import React, { useState } from "react";

export default function AdminDashboard() {
  const [rooms, setRooms] = useState([
    { id: 1, title: "Single Room - Baneshwor", owner: "Ram", status: "Pending" },
    { id: 2, title: "Flat - Kalanki", owner: "Sita", status: "Approved" },
    { id: 3, title: "Room - Koteshwor", owner: "Hari", status: "Pending" },
  ]);

  const updateStatus = (id, status) => {
    setRooms(
      rooms.map((room) =>
        room.id === id ? { ...room, status } : room
      )
    );
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h1>Admin Dashboard – Room Finder</h1>

      {/* Stats */}
      <div style={{ display: "flex", gap: "20px", marginBottom: "20px" }}>
        <div style={cardStyle}>
          <h3>Total Rooms</h3>
          <p>120</p>
        </div>
        <div style={cardStyle}>
          <h3>Total Users</h3>
          <p>85</p>
        </div>
        <div style={cardStyle}>
          <h3>Approved Listings</h3>
          <p>90</p>
        </div>
      </div>

      {/* Room Table */}
      <table width="100%" border="1" cellPadding="10" style={{ borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th>Title</th>
            <th>Owner</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {rooms.map((room) => (
            <tr key={room.id}>
              <td>{room.title}</td>
              <td>{room.owner}</td>
              <td>{room.status}</td>
              <td>
                <button onClick={() => updateStatus(room.id, "Approved")}>
                  Approve
                </button>
                <button
                  onClick={() => updateStatus(room.id, "Rejected")}
                  style={{ marginLeft: "10px" }}
                >
                  Reject
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

