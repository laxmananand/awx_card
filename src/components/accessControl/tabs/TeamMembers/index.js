import React, { useEffect, useState } from "react";
import UserList from "./UserList";
import BreadCrumbs from "../../../structure/BreadCrumbs";
import CreateMember from "./CreateMember";
import DetailsBar from "./DetailsBar";
import { useSearchParams } from "react-router-dom";
import { GroupAdd, Groups } from "@mui/icons-material";
import { IconButton } from "@mui/material";

function TeamMembers() {
  const [showDetails, setShowDetails] = useState(false);
  const [showArray, setShowArray] = useState(new Array(11).fill(false));
  const [activeArray, setActiveArray] = useState(new Array(11).fill(false));

  const [searchParams] = useSearchParams();
  const autoOpen = searchParams.get("addTeam");

  const handleShow = (idx) => {
    const array = new Array(11).fill(false);
    array[idx] = true;
    setShowArray(array);
  };

  const handleActive = (idx) => {
    const array = new Array(11).fill(false);
    array[idx] = true;
    setActiveArray(array);
  };

  const [stage, setStage] = useState("show");

  return (
    <div>
      <BreadCrumbs
        data={{
          name: "Team & Access",
          img: "/arrows/arrowLeft.svg",
          backurl: "/access-control",
          info: true,
        }}
      />
      <div className="">
        <div className="row m-3 bg-white border p-4 d-flex rounded-3 flex-fill">
          <div className="p-3 d-flex justify-content-between align-items-baseline">
            <div className="d-flex align-items-center gap-3">
              <IconButton className="rounded-circle p-2 bg-dark border-dark">
                {" "}
                <Groups className="fs-3 fw-bold text-white" />
              </IconButton>
              <label className="fs-5 fw-bold">Users</label>
            </div>

            <IconButton
              className="rounded-pill bg-dark border-dark"
              style={{ padding: "0.75rem 2rem" }}
            >
              {" "}
              <GroupAdd className="fs-7 fw-bold text-white" />
              <label
                htmlFor=""
                className="text-white ps-2"
                style={{ fontSize: 14 }}
              >
                Invite user
              </label>
            </IconButton>
          </div>

          <UserList />
        </div>
      </div>
    </div>
  );
}

export default TeamMembers;
