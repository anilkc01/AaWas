import { useState } from "react";

export default function ViewRegisteredUsers() {
  const [users] = useState([
    { id: 1, name: "Ram Sharma", email: "ram@gmail.com" },
    { id: 2, name: "Sita Rai", email: "sita@gmail.com" },
    { id: 3, name: "Hari Karki", email: "hari@gmail.com" },
  ]);

  return (
    <div>
      <h2>Registered Users</h2>

      {users.length === 0 ? (
        <p>No users registered</p>
      ) : (
        <table border="1" cellPadding="8">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
            </tr>
          </thead>

          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.name}</td>
                <td>{user.email}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
