import React, { useEffect, useState, useMemo } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import CustomInput from "../../../structure/NewStructures/CustomInput";
import CustomSelect from "../../../structure/NewStructures/CustomSelect";
import { MoreHoriz, MoreVert, PersonSearch, Search } from "@mui/icons-material";
import { IconButton } from "@mui/material";
import CustomTable from "../../../structure/NewStructures/CustomTable";

function UserList() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRole, setSelectedRole] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [stage, setStage] = useState("show");

  const rolesOptions = [
    { value: "admin", label: "Account Admin" },
    { value: "owner", label: "Owner" },
    { value: "cardholder", label: "Cardholder" },
  ];

  const statusOptions = [
    { value: "active", label: "Active" },
    { value: "inactive", label: "Inactive" },
    { value: "blocked", label: "Blocked" },
  ];

  const allUsers = [
    {
      id: 74358,
      user: { name: "John Doe", email: "john.doe@example.com" },
      roles: "Cardholder",
      manager: "Add",
      status: "active",
      joined: "2025-05-02",
    },
    {
      id: 57848,
      user: {
        name: "Alison Pacocha Behringer",
        email: "alison.behringer@example.com",
      },
      roles: "Cardholder",
      manager: "Add",
      status: "active",
      joined: "2025-04-22",
    },
    {
      id: 75834,
      user: { name: "Faye Wolf Rolfson", email: "faye.rolfson@example.com" },
      roles: "Cardholder",
      manager: "Add",
      status: "active",
      joined: "2025-04-22",
    },
    {
      id: 54736,
      user: {
        name: "Dulce Gusikowski",
        email: "dulce.gusikowski@example.com",
      },
      roles: "Cardholder",
      manager: "Add",
      status: "inactive",
      joined: "2025-04-14",
    },
    {
      id: 73485,
      user: {
        name: "Clotilde Upton",
        email: "clotilde.upton@example.com",
      },
      roles: "Cardholder",
      manager: "Add",
      status: "active",
      joined: "2025-04-11",
    },
    {
      id: 88901,
      user: { name: "Admin User", email: "admin@example.com" },
      roles: "admin",
      manager: "Edit",
      status: "active",
      joined: "2025-03-15",
    },
    {
      id: 61234,
      user: { name: "Owner One", email: "owner1@example.com" },
      roles: "owner",
      manager: "Add",
      status: "blocked",
      joined: "2025-02-01",
    },
    // Add more users as needed...
  ];

  const filteredUsers = useMemo(() => {
    return allUsers.filter((user) => {
      const searchMatch =
        searchTerm.toLowerCase() === "" ||
        user.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.user.email.toLowerCase().includes(searchTerm.toLowerCase());

      const roleMatch =
        selectedRole === "" ||
        user.roles.toLowerCase() === selectedRole?.value?.toLowerCase();

      const statusMatch =
        selectedStatus === "" ||
        user.status.toLowerCase() === selectedStatus?.value?.toLowerCase();

      return searchMatch && roleMatch && statusMatch;
    });
  }, [allUsers, searchTerm, selectedRole, selectedStatus]);

  const columns = [
    {
      id: "user",
      label: "USERNAME",
    },
    {
      id: "email",
      label: "EMAIL ADDRESS",
    },
    { id: "roles", label: "ROLES" },
    { id: "manager", label: "MANAGER", align: "center" },
    { id: "status", label: "STATUS" },
    { id: "joined", label: "JOINED" },
    {
      id: "actions",
      label: "",
    },
  ];

  const rows = useMemo(() => {
    return filteredUsers.map((user) => ({
      id: user.id,
      user: user.user.name,
      email: user.user.email,
      roles: user.roles,
      manager: user.manager && (
        <label
          className="text-primary text-decoration-underline"
          style={{ fontSize: 14, fontWeight: "bold", cursor: "pointer" }}
        >
          {user.manager?.toUpperCase()}
        </label>
      ),
      status:
        user.status === "active" ? (
          <button
            className="text-white bg-success px-4 border-0 py-2 rounded-pill"
            style={{ fontSize: 12, fontWeight: 500 }}
          >
            {user.status?.toUpperCase()}
          </button>
        ) : (
          <button
            className="text-white bg-secondary px-4 border-0 py-2 rounded-pill"
            style={{ fontSize: 12, fontWeight: 500 }}
          >
            {user.status?.toUpperCase()}
          </button>
        ),
      joined: user.joined,
      actions: (
        <IconButton>
          <MoreHoriz />
        </IconButton>
      ),
    }));
  }, [filteredUsers]);

  return (
    <>
      {stage === "show" ? (
        <div>
          <div className="d-flex align-items-end justify-content-between gap-4 my-4">
            <CustomInput
              placeholder={`Search by Name or Email`}
              value={searchTerm}
              onInput={(e) => setSearchTerm(e.target.value)}
              leftIcon={<PersonSearch />}
              label={`Search`}
              required
            />

            <CustomSelect
              options={rolesOptions}
              value={selectedRole}
              onChange={setSelectedRole}
              label={`Roles`}
              required
            />

            <CustomSelect
              options={statusOptions}
              value={selectedStatus}
              onChange={setSelectedStatus}
              label={`Status`}
              required
            />
          </div>

          <div className="table-responsive mt-3">
            <CustomTable columns={columns} rows={rows} />
          </div>
        </div>
      ) : (
        <></>
      )}
    </>
  );
}

export default UserList;
