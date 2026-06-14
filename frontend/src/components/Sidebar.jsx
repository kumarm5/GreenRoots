import React from "react";
import { Drawer, List, ListItemButton, ListItemIcon, ListItemText, Box, Typography, Avatar } from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import AccountTreeIcon from "@mui/icons-material/AccountTree";
import SearchIcon from "@mui/icons-material/Search";
import UpdateIcon from "@mui/icons-material/Update";
import EmojiNatureIcon from "@mui/icons-material/EmojiNature";
import SettingsIcon from "@mui/icons-material/Settings";
import LogoutIcon from "@mui/icons-material/Logout";
import { useNavigate } from "react-router-dom";

export default function Sidebar({ user }) {
  const navigate = useNavigate();
  const nav = (path) => navigate(path);

  return (
    <Drawer variant="permanent" open={true} sx={{ width: 256, flexShrink: 0, "& .MuiDrawer-paper": { width: 256, boxSizing: "border-box", border: "none", bgcolor: "transparent" } }}>
      <Box sx={{ px: 2, py: 3 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Avatar sx={{ bgcolor: "primary.main" }}>{user?.first_name?.[0] || "G"}</Avatar>
          <Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>{user?.first_name || "Supporter"}</Typography>
            <Typography variant="caption" color="text.secondary">Supporter</Typography>
          </Box>
        </Box>

        <List sx={{ mt: 3 }}>
          <ListItemButton onClick={() => nav("/supporter-dashboard")} selected>
            <ListItemIcon><DashboardIcon /></ListItemIcon>
            <ListItemText primary="Dashboard" />
          </ListItemButton>

          <ListItemButton onClick={() => nav("/my-supported-projects")}>
            <ListItemIcon><AccountTreeIcon /></ListItemIcon>
            <ListItemText primary="My Supported Projects" />
          </ListItemButton>

          <ListItemButton onClick={() => nav("/projects")}>
            <ListItemIcon><SearchIcon /></ListItemIcon>
            <ListItemText primary="Browse Projects" />
          </ListItemButton>

          <ListItemButton onClick={() => nav("/project-updates")}>
            <ListItemIcon><UpdateIcon /></ListItemIcon>
            <ListItemText primary="Project Updates" />
          </ListItemButton>

          <ListItemButton onClick={() => nav("/my-impact")}>
            <ListItemIcon><EmojiNatureIcon /></ListItemIcon>
            <ListItemText primary="My Impact" />
          </ListItemButton>

          <ListItemButton onClick={() => nav("/profile")}>
            <ListItemIcon><SettingsIcon /></ListItemIcon>
            <ListItemText primary="Profile" />
          </ListItemButton>

          <ListItemButton onClick={() => { localStorage.removeItem("token"); window.location.href = "/"; }}>
            <ListItemIcon><LogoutIcon /></ListItemIcon>
            <ListItemText primary="Logout" />
          </ListItemButton>
        </List>
      </Box>
    </Drawer>
  );
}