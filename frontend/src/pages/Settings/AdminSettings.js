import {
  Button,
  List,
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
  Typography,
} from "@mui/material";
import Cookies from "js-cookie";
import React, { useEffect, useState } from "react";
import "./AdminSettings.css";
import {useNavigate} from "react-router-dom";
import ConfirmTADelete from "../../components/ConfirmTADelete/ConfirmTADelete";

const AdminSettings = () => {
  const [teams, setTeams] = useState([]);
  const [tas, setTAs] = useState([]);
  const [newTeamName, setNewTeamName] = useState("");
  const [newTAName, setNewTAName] = useState("");
  const [newTAEmail, setNewTAEmail] = useState("");
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedTA, setSelectedTA] = useState(null); // To track which TA is being deleted
  const [idNameMap, setIdToNameMap] = useState({});
  const token = Cookies.get("token");
  const navigate = useNavigate();
  useEffect(() => {
    fetchTeams();
    fetchTAs();
  }, []);

  const fetchTeams = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/api/teams`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) throw new Error("Failed to fetch teams.");
      const data = await response.json();
      setTeams(data);
    } catch (error) {
      console.error(error);
    }
  };

  const convertToMap = (list) => {
    return list.reduce((acc, obj) => { //map ID to name
      acc[obj.user_id] = obj.name;
      return acc;
    }, {});
  };

  const fetchTAs = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/api/users/role/TA`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) throw new Error("Failed to fetch TAs.");
      const data = await response.json();
      setTAs(data);

      const idToNameMap = convertToMap(data);
      setIdToNameMap(idToNameMap);
    } catch (error) {
      console.error(error);
    }
  };

  const addTeam = async () => {
    if (!newTeamName.trim())           //validation check to prevent adding blank team name
    {
      alert("Team name cannot be blank.");
      return;
    }
    
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/api/teams`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ team_name: newTeamName }),
        }
      );

      if (!response.ok) throw new Error("Failed to add team.");
      setNewTeamName("");
      fetchTeams(); // Refresh the list of teams
    } catch (error) {
      console.error(error);
    }
  };

  const addTA = async () => {
    if (!newTAName.trim())           //validation check to prevent adding blank TA name
    {
      alert("TA name cannot be blank.");
      return;
    }
    if (!newTAEmail.trim())           //validation check to prevent adding blank TA email
    {
      alert("TA Email name cannot be blank.");
      return;
    }
    
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/api/users`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            name: newTAName,
            email: newTAEmail,
            role: "TA",
            password: "password", // Default password
          }),
        }
      );

      if (!response.ok) throw new Error("Failed to add TA.");
      setNewTAName("");
      setNewTAEmail("");
      fetchTAs(); // Refresh the list of TAs
    } catch (error) {
      console.error(error);
    }
  };

  const deleteTeam = async (teamId) => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/api/teams/${teamId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) throw new Error("Failed to delete team.");
      fetchTeams(); // Refresh the list of teams
    } catch (error) {
      console.error(error);
    }
  };

  const deleteTA = async (taId) => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/api/users/${taId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) throw new Error("Failed to delete TA.");
      fetchTAs(); // Refresh the list of TAs
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = (ta) => {
    console.log("Delete TA Button Clicked");
    setSelectedTA(ta);
    setDeleteOpen(true);
  }

  const deletePopupClose = () => {
    setDeleteOpen(false);
    setSelectedTA(null); // Clear the selected TA
  };


  return (
    <div className="settings-container">
      <Typography variant="h4" className="settings-title">
        Settings
      </Typography>
      {/* Teams Section */}
      <div className="section-container">
        <Typography variant="h5" className="section-title">
          Teams
        </Typography>
        <List className="scrollable-list">
          {teams.map((team) => (
            <ListItem key={team.team_id}>
              <ListItemText primary={team.team_name} />
              <ListItemSecondaryAction>
                <Button
                  color="secondary"
                  onClick={() => deleteTeam(team.team_id)}
                >
                  Delete
                </Button>
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>
        <div className="add-form">
          <input
            type="text"
            value={newTeamName}
            placeholder="New Team Name"
            onChange={(e) => setNewTeamName(e.target.value)}
          />
          <Button variant="contained" onClick={addTeam}>
            Add Team
          </Button>
        </div>
      </div>

      {/* Teaching Assistants Section */}
      <div className="section-container">
        <Typography variant="h5" className="section-title">
          Teaching Assistants (TAs)
        </Typography>
        <List className="scrollable-list">
          {tas.map((ta) => (
            <ListItem key={ta.user_id}>
              <ListItemText primary={`${ta.name} (${ta.email})`} />
              <ListItemSecondaryAction>
                <Button color="secondary" onClick={() => handleDelete(ta)}> {/* reassign tickets, then deleteTA */}
                  Delete
                </Button>
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>
        {deleteOpen && (
            <ConfirmTADelete
              handleOpen={deleteOpen}
              handleClose={deletePopupClose}
              ta={selectedTA}
              idNameMap={idNameMap}
            />
        )}
        <div className="add-form">
          <input
            type="text"
            value={newTAName}
            placeholder="New TA Name"
            onChange={(e) => setNewTAName(e.target.value)}
          />
          <input
            type="email"
            value={newTAEmail}
            placeholder="New TA Email"
            onChange={(e) => setNewTAEmail(e.target.value)}
          />
          <Button variant="contained" onClick={addTA}>
            Add TA
          </Button>
        </div>
      </div>
      <div className="redirect-button">
      <button
        variant="contained"
        onClick={()=>navigate('/profile')}
        >
          Go To Account Settings
          </button>
    </div>
    </div>
  );
};

export default AdminSettings;
