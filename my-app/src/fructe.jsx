import React, { useState, useEffect } from "react";
import axios from "axios";
import "./IndexPage.css";

export default function Fructe() {
  const [users, setUsers] = useState([]);
  const [loadingUserId, setLoadingUserId] = useState(null);
  const [search, setSearch] = useState("");
  const [selectedFamily, setSelectedFamily] = useState(""); // NEW

  const allPermissions = [
    "Adauga",
    "Administrare",
    "Concedii",
    "Modificari Cazari",
    "Modifica Flota",
    "Modifica Angajati",
    "Modif Companii",
    "Modifica",
    "Vezi Cazari",
    "Flota",
    "Companii",
    "Personal Ro",
    "Personal Strain",

  ];

  useEffect(() => {
    async function fetchUsers() {
      try {
        const res = await axios.get("/users/permissions");
        console.log("Fetched users:", res.data);
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

  // Extract unique families from users
  const families = Array.from(new Set(users.map((u) => u.family).filter(Boolean)));

  // Apply filters
  const filteredUsers = users.filter((user) => {
    const matchFamily = selectedFamily ? user.family === selectedFamily : true;
    const matchSearch = user.name.toLowerCase().includes(search.toLowerCase());
    return matchFamily && matchSearch;
  });

  return (
    <div className="access-manager-container">
      <h2 className="access-manager-title">Gestionare Acces</h2>

      {/* Search input */}
      <input
        type="text"
        className="search-input"
        placeholder="Search users..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* Family filter buttons */}
      <div className="family-filter">
        <button
          onClick={() => setSelectedFamily("")}
          className={selectedFamily === "" ? "active" : ""}
        >
          Toate Firmele
        </button>
        {families.map((fam) => (
          <button
            key={fam}
            onClick={() => setSelectedFamily(fam)}
            className={selectedFamily === fam ? "active" : ""}
          >
            {fam}
          </button>
        ))}
      </div>

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
                <div className="user-name">{user.name} </div>
                <div className="user-family">  {user.family}</div> {/* SHOW FAMILY */}
              </div>

              <button
                className="delete-button"
                disabled={loadingUserId === user._id}
                onClick={() => deleteUser(user._id)}
              >
                {loadingUserId === user._id ? <span className="loader" /> : "Șterge utilizator"}
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
