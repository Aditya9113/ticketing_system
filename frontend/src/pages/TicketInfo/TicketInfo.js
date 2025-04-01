import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import { Typography } from "@mui/material";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Stack from "@mui/material/Stack";
import Cookies from "js-cookie";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ConfirmDelete from "../../components/ConfirmDelete/ConfirmDelete";
//import ConfirmEdit function made
import ConfirmEdit from "../../components/ConfirmEdit/ConfirmEdit";
import EditTicket from "../../components/EditTicket/EditTicket";
import ReplySection from "../../components/ReplySection/ReplySection";
import TicketStatusIndicator from "../../components/TicketStatusIndicator/TicketStatusIndicator";
import "./TicketInfo.css";
const baseURL = process.env.REACT_APP_API_BASE_URL;

const TAs = ["John Smith"];
const TicketSubject = "Sponsor Isn’t Responding";

const TicketInfo = () => {
  const [deleteOpen, setDeleteOpen] = useState(false);
  //add a editOpen state and a setEditOption function to control edit Ticket confirmation popup
  const [editOpen, setEditOpen] = useState(false);
  //add a editFormOpen state and a setEditFormOpen function to control edit form popup
  const [editFormOpen, setEditFormOpen] = useState(false);
  const [ticketData, setTicketData] = useState(null);
  const [repliesData, setRepliesData] = useState(null);
  const [loadingTicketData, setLoadingTicketData] = useState(true);
  const [loadingRepliesData, setLoadingRepliesData] = useState(true);
  const [error, setError] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const urlParameters = new URLSearchParams(location.search);
  const ticketId = urlParameters.get("ticket");

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

  if (error) {
    // navigate("/unauthorized");
  }

  //Robert Naff: Need to have Back button do something
  const handleBack = () => {
    //Goes back to previous page in history
    console.log("Back Button Clicked");
    navigate(-1);
    console.log("Back in Previous Page");
  };

  //Robert: We need to be able te edit a ticket
  const handleEditTicket = () => {
    console.log("Edit Ticket Button Clicked");
    setEditOpen(true);
  };

  //handle closure of edit confirmation popup
  const editPopupClose = () => {
    setEditOpen(false);
  }

  const handleConfirmEdit = () => {
    console.log("Confirm Edit clicked");
    setEditOpen(false);
    setEditFormOpen(true);
  }

  //handle saving the edited ticket
  const handleSaveEdit = async () => {
    setEditOpen(false);
    try {
      const token = Cookies.get("token");
      console.log("Editing Ticket: ", ticketId);

      const response = await fetch(`${baseURL}/api/tickets/${ticketId}/edit`, {
        method: "PUT", 
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          status: "Updated", 
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to edit ticket");
      }

      console.log("Ticket successfully updated!");

      setEditFormOpen(false);
      fetchData(); // Refresh ticket info after edit
    } catch (error) {
      console.error("Error editing ticket:", error);
    }
  };

  const handleDeleteTicket = () => {
    console.log("Delete Ticket Button Clicked");
    setDeleteOpen(true);
  };

  const deletePopupClose = () => {
    setDeleteOpen(false);
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
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              backgroundColor: "#DBDADA",
              padding: 50,
              gap: 50,
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 20,
                backgroundColor: "#FFFFFF",
                padding: 20,
                borderRadius: 5,
                flex: 1,
              }}
            >
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
                    status={ticketData.status?.toUpperCase() || "UNKNOWN"}
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
                  <ConfirmEdit
                    handleOpen={editOpen}
                    handleClose={editPopupClose}
                    onConfirmEdit={handleConfirmEdit} //Pass the navigation function
                  />
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
                <div className="ticketAsset">
                  {ticketData.issue_description}
                </div>
                <h3>Student:</h3>
                <div className="ticketAsset">
                  {ticketData.student_name}
                </div>
                <h3>TA:</h3>
                <div className="ticketAsset">
                  {TAs.map((TaName) => (
                    <div key={TaName}>{TaName}</div>
                  ))}
                </div>
                <h3>Project:</h3>
                <div className="ticketAsset">
                  {ticketData.team_name}
                </div>
                <h3>Replies:</h3>
                <ReplySection />
              </Stack>
            </div>
            {/* Render EditTicket when editFormOpen is true */}
            {editFormOpen && (
              <EditTicket
                ticketId={ticketId}
                onClose={() => setEditFormOpen(false)} // Close form when user is done
              />
            )}
          </div>
        ) : (
          <div>Loading Ticket Info...</div>
        )}
      </>
    )};

export default TicketInfo;
