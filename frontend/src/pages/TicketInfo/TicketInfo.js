import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import { Typography } from "@mui/material";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Stack from "@mui/material/Stack";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ConfirmDelete from "../../components/ConfirmDelete/ConfirmDelete";
import ConfirmReassign from "../../components/ConfirmReassign/ConfirmReassign";
import ReplySection from "../../components/ReplySection/ReplySection";
import TicketStatusIndicator from "../../components/TicketStatusIndicator/TicketStatusIndicator";
import "./TicketInfo.css";
const baseURL = process.env.REACT_APP_API_BASE_URL;

const TicketSubject = "Sponsor Isn’t Responding";

const TicketInfo = () => {
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [reassignOpen, setReassignOpen] = useState(false);
  const [ticketData, setTicketData] = useState(null);
  const [repliesData, setRepliesData] = useState(null);
  const [loadingTicketData, setLoadingTicketData] = useState(true);
  const [loadingRepliesData, setLoadingRepliesData] = useState(true);
  const [error, setError] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const token = Cookies.get("token");
  const decodedToken = jwtDecode(token);
  const userType = decodedToken.role;

  const urlParameters = new URLSearchParams(location.search);
  const ticketId = urlParameters.get("ticket");

  const [AssignedID, setAssignedID] = useState([]);
  const [idToNameMap, setIdToNameMap] = useState({});

  const fetchData = async () => {
    try {
      const token = Cookies.get("token");

      const ticketDataResponse = await fetch(
        `${baseURL}/api/tickets/info/${ticketId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!ticketDataResponse.ok) {
        throw new Error("Failed to fetch tickets");
      }

      const ticketData = await ticketDataResponse.json();
      console.log("Ticket Data: ", ticketData);
      setTicketData(ticketData);
      setLoadingTicketData(false);
    } catch (err) {
      console.log("Error: ", error);
      setError(true);
    }
  };

  useEffect(() => {
    fetchData();
  }, [ticketId]);

  //TICKET ASSIGNMENTS: from ticket_id get user_id (database has multiple users assigned to same ticket?)
  const getAssignedTAID = async () => {
    try {
      const token = Cookies.get("token");
      
      const getResponse = await fetch(
        `${baseURL}/api/ticketassignments/ticket/${ticketId}`,
        {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        });

        if (!getResponse.ok) {
          console.error(`Failed to get assigned TAs ID. Status: ${getResponse.status}`);
          console.error(`${getResponse.reason}`);
        }
      
        const list = await getResponse.json();
        const TA_id = list.map(obj => obj.user_id)[0]; //if tickets have multiple TAs, only get the first one
        setAssignedID(TA_id);
        
        //console.log("Assigned ID: ", AssignedID);

      } catch (err) {
        console.log("Error: ", error);
        setError(true);
      }
  }

  const getTAs = async () => {
    try {
      const token = Cookies.get("token");
      
      const getResponse = await fetch(
        `${baseURL}/api/users/role/TA`,
        {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        });

        if (!getResponse.ok) {
          console.error(`Failed to get TAs. Status: ${getResponse.status}`);
          console.error(`${getResponse.reason}`);
        }
      
        const list = await getResponse.json();
        
        const idToNameMap = list.reduce((acc, obj) => { //map ID to name
          acc[obj.user_id] = obj.name;
          return acc;
        }, {});
        setIdToNameMap(idToNameMap);


      } catch (err) {
        console.log("Error: ", error);
        setError(true);
      }
  }

  useEffect(() => {
    getTAs();
    getAssignedTAID();    
  }, []);

  if (error) {
    // navigate("/unauthorized");
  }

  const handleBack = () => {
    console.log("Back Button Clicked");
  };

  const handleEditTicket = () => {
    console.log("Edit Ticket Button Clicked");
  };

  const handleDeleteTicket = () => {
    console.log("Delete Ticket Button Clicked");
    setDeleteOpen(true);
  };

  const handleReassignTicket = () => {
    console.log("Reassign TA Button Clicked");
    setReassignOpen(true);
  };

  const deletePopupClose = () => {
    setDeleteOpen(false);
  };

  const reassignPopupClose = () => {
    setReassignOpen(false);
  };
  
  const updateTA = (newTAID) => { //update TA ID from Confirm Reassign popup
    //console.log("old tA", typeof AssignedID)
    //console.log("New TA ID: ", typeof newTAID);
    setAssignedID(newTAID);
  };

  if (loadingTicketData) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh", // Full viewport height to center vertically
          backgroundColor: "#f0f0f0", // Optional: a subtle background color
          flexDirection: "column",
          gap: "20px",
        }}
      >
        <CircularProgress size={80} thickness={4} />{" "}
        {/* Adjust size and thickness */}
        <Typography variant="h6" sx={{ color: "#8C1D40" }}>
          Loading, please wait...
        </Typography>
      </div>
    );
  }

  return (
    <>
      {!loadingTicketData ? (
        <div className="ticketInfoContainer">
          <Stack className="ticketInfo">
            <Button
              variant="text"
              className="backButton"
              onClick={handleBack}
              startIcon={<ArrowBackIosNewIcon />}
            >
              Back
            </Button>
            <div className="ticketId">Capstone Ticket - {ticketId}</div>
            <div className="subject">{TicketSubject}</div>
            <Stack direction="row" className="statusButtons">
              <TicketStatusIndicator
                status={ticketData.status.toUpperCase() || "UNKNOWN"}
              />
              {ticketData.escalated && (
                <TicketStatusIndicator status={"ESCALATED"} />
              )}
              <Button
                variant="contained"
                className="editButton"
                onClick={handleEditTicket}
              >
                Edit Ticket
              </Button>
              <Button
                variant="contained"
                className="deleteButton"
                onClick={handleDeleteTicket}
              >
                Delete Ticket
              </Button>
              <ConfirmDelete
                handleOpen={deleteOpen}
                handleClose={deletePopupClose}
              />
            </Stack>
            <h3>Description:</h3>
            <div className="ticketDescription">
              {ticketData.issue_description}
            </div>
            <h3>Replies:</h3>
            <ReplySection></ReplySection>
          </Stack>
          <Stack className="ticketUsers">
            <div>
              Student:
              <div>{ticketData.student_name}</div>
            </div>
            <div>
              TA: {idToNameMap[AssignedID]}&nbsp; 
              {userType === "admin" && (
              <Button
                variant="contained"
                className="reassignButton"
                style={{ marginTop: '10px' }} 
                onClick={handleReassignTicket}
              >
                Reassign
              </Button>
              )}
              <ConfirmReassign
                handleOpen={reassignOpen}
                handleClose={reassignPopupClose}
                ticketID={ticketId}
                oldTAID = {AssignedID}
                idNameMap={idToNameMap}
                updateTA={updateTA}
              />
              
            </div>
            <div>
              Project:
              <div>{ticketData.team_name}</div>
            </div>
          </Stack>
        </div>
      ) : (
        <div>Loading Ticket Info...</div>
      )}
    </>
  );
};

export default TicketInfo;
