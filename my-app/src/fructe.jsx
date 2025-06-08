import React, { useState, useEffect } from "react";
import axios from "axios";
import "./IndexPage.css";

export default function Fructe() {
  const [users, setUsers] = useState([]);
  const [loadingUserId, setLoadingUserId] = useState(null);
  const [search, setSearch] = useState("");

  const allPermissions = [
    "Adauga",
    "Administrare",
    "Concedii",
    "Modificari Cazari",
    "Modifica Flota",
    "Modifica Angajati",
    "Modif Companii",
    "Modifica",
  ];

  useEffect(() => {
    async function fetchUsers() {
      try {
        const res = await axios.get("/users/permissions");
        setUsers(res.data);
      } catch (err) {
        console.error("Failed to fetch users with permissions", err);
      }
    }
    fetchUsers();
  }, []);

  async function togglePermission(userId, permission) {
    setLoadingUserId(userId);
    try {
      const user = users.find((u) => u._id === userId);
      if (!user) return;

      const newPermissions = {
        ...(user.permissions || {}),
        [permission]: !user.permissions?.[permission],
      };

      await axios.put(`/users/${userId}/permissions`, { permissions: newPermissions });

      setUsers((prevUsers) =>
        prevUsers.map((u) =>
          u._id === userId ? { ...u, permissions: newPermissions } : u
        )
      );
    } catch (error) {
      console.error("Failed to update permission", error);
    } finally {
      setLoadingUserId(null);
    }
  }

  async function deleteUser(userId) {
    if (!window.confirm("Are you sure you want to delete this user?")) {
      return;
    }
    setLoadingUserId(userId);
    try {
      await axios.delete(`/users/${userId}`);
      setUsers((prevUsers) => prevUsers.filter((user) => user._id !== userId));
    } catch (error) {
      console.error("Failed to delete user", error);
      alert("Failed to delete user");
    } finally {
      setLoadingUserId(null);
    }
  }

  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="access-manager-container">
      <h2 className="access-manager-title">Gestionare Acces</h2>

      <input
        type="text"
        className="search-input"
        placeholder="Search users..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {filteredUsers.length === 0 ? (
        <p className="no-users-text">No users found.</p>
      ) : (
        <div className="users-grid">
          {filteredUsers.map((user) => (
            <div key={user._id} className="user-card">
              <div className="user-info">
                <div className="avatar">
                  {user.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase()}
                </div>
                <div className="user-name">{user.name}</div>
              </div>

              <button
                className="delete-button"
                disabled={loadingUserId === user._id}
                onClick={() => deleteUser(user._id)}
              >
                {loadingUserId === user._id ? "Deleting..." : "Delete"}
              </button>

              <div className="permissions-list">
                {allPermissions.map((perm) => {
                  const checked = !!user.permissions?.[perm];
                  const isLoading = loadingUserId === user._id;
                  return (
                    <label key={perm} className="toggle-switch">
                      <input
                        type="checkbox"
                        checked={checked}
                        disabled={isLoading}
                        onChange={() => togglePermission(user._id, perm)}
                      />
                      <span className="slider"></span>
                      <span className="permission-label">{perm}</span>
                      {isLoading && <div className="spinner"></div>}
                    </label>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
