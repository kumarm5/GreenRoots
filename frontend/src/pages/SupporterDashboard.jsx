import React, { useEffect, useState } from "react";
import { Box, Grid, Paper, Typography, IconButton, InputBase, Avatar, CircularProgress, Stack, Button } from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import SearchIcon from "@mui/icons-material/Search";
import Sidebar from "../components/Sidebar";
import MetricsCard from "../components/MetricsCard";
import SupporterProjectCard from "../components/SupporterProjectCard";
import UpdateCard from "../components/UpdateCard";
import api from "../api";

export default function SupporterDashboard() {
  const [user, setUser] = useState(null);
  const [metrics, setMetrics] = useState(null);
  const [projects, setProjects] = useState([]);
  const [updates, setUpdates] = useState([]);
  const [recommended, setRecommended] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    let mounted = true;
    async function load() {
      setLoading(true);
      try {
        const [meRes, metricsRes, projRes, updatesRes, recRes] = await Promise.allSettled([
          api.get("/accounts/me/"),
          api.get("/plantations/supporter-metrics/"),
          api.get("/plantations/my-supported-projects/"),
          api.get("/plantations/supporter-updates/"),
          api.get("/plantations/recommended-projects/"),
        ]);

        if (!mounted) return;

        if (meRes.status === "fulfilled") setUser(meRes.value.data);
        if (metricsRes.status === "fulfilled") setMetrics(metricsRes.value.data);
        if (projRes.status === "fulfilled") setProjects(projRes.value.data || []);
        if (updatesRes.status === "fulfilled") setUpdates(updatesRes.value.data || []);
        if (recRes.status === "fulfilled") setRecommended(recRes.value.data || []);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    load();
    return () => { mounted = false; };
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "60vh" }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ display: "flex", bgcolor: "background.default", minHeight: "100vh" }}>
      <Sidebar user={user} />

      <Box sx={{ flex: 1, p: 4, maxWidth: "100%", ml: 4 }}>
        {/* Welcome + Search */}
        <Grid container spacing={3} alignItems="center">
          <Grid item xs={12} md={8}>
            <Typography variant="h5" sx={{ fontWeight: 800 }}>Hello, {user?.first_name || "Friend"} 👋</Typography>
            <Typography variant="h4" sx={{ fontWeight: 900, mt: 1 }}>Thank You for Supporting a Greener Future</Typography>
            <Typography color="text.secondary" sx={{ mt: 1 }}>Track your impact, discover plantation projects, and help communities grow greener.</Typography>
          </Grid>

          <Grid item xs={12} md={4} sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}>
            <Box sx={{ display: "flex", alignItems: "center", bgcolor: "white", borderRadius: 4, px: 2, boxShadow: "0 6px 18px rgba(17,24,39,0.04)" }}>
              <SearchIcon color="action" />
              <InputBase placeholder="Search projects, locations..." value={search} onChange={(e) => setSearch(e.target.value)} sx={{ ml: 1, width: 260 }} />
            </Box>
            <IconButton><NotificationsIcon /></IconButton>
            <Avatar src={user?.profile_photo || ""} />
          </Grid>
        </Grid>

        {/* Metrics */}
        <Box sx={{ mt: 4 }}>
          <Grid container spacing={2}>
            <Grid item xs={6} md={3}><MetricsCard value={metrics?.projects_supported || 0} label="Projects Supported" /></Grid>
            <Grid item xs={6} md={3}><MetricsCard value={metrics?.resources_contributed || 0} label="Resources Contributed" /></Grid>
            <Grid item xs={6} md={3}><MetricsCard value={metrics?.trees_impacted || 0} label="Trees Impacted" /></Grid>
            <Grid item xs={6} md={3}><MetricsCard value={metrics?.states_reached || 0} label="States Reached" /></Grid>
          </Grid>
        </Box>

        {/* My Supported Projects */}
        <Box sx={{ mt: 6 }}>
          <Typography variant="h6" sx={{ fontWeight: 800, mb: 2 }}>My Supported Projects</Typography>
          {projects.length === 0 ? (
            <Paper sx={{ borderRadius: 3, p: 6, textAlign: "center" }}>
              <Typography variant="h6" sx={{ fontWeight: 800 }}>Start Your Green Journey</Typography>
              <Typography color="text.secondary" sx={{ mt: 1, mb: 2 }}>You haven't supported a project yet. Browse projects to make an impact.</Typography>
              <Button variant="contained" onClick={() => (window.location.href = "/projects")}>Browse Projects</Button>
            </Paper>
          ) : (
            <Box sx={{ display: "flex", overflowX: "auto", py: 1 }}>
              {projects.map((p) => (
                <SupporterProjectCard key={p.id} project={p} onView={(proj) => window.location.href = `/projects/${proj.id}`} onUpdates={(proj) => window.location.href = `/projects/${proj.id}#updates`} />
              ))}
            </Box>
          )}
        </Box>

        {/* Latest Updates */}
        <Box sx={{ mt: 6 }}>
          <Typography variant="h6" sx={{ fontWeight: 800, mb: 2 }}>Latest Project Updates</Typography>
          <Stack spacing={2}>
            {updates.slice(0, 5).map((u) => <UpdateCard key={u.id} update={u} />)}
            {updates.length === 0 && <Typography color="text.secondary">No recent updates from your supported projects.</Typography>}
          </Stack>
        </Box>

        {/* Recommended Projects */}
        <Box sx={{ mt: 6 }}>
          <Typography variant="h6" sx={{ fontWeight: 800, mb: 2 }}>Projects That Need Support</Typography>
          <Grid container spacing={3}>
            {(recommended.slice(0, 6)).map((r) => (
              <Grid item xs={12} sm={6} md={4} key={r.id}>
                <Paper sx={{ borderRadius: 3, overflow: "hidden", boxShadow: "0 8px 26px rgba(17,24,39,0.06)" }}>
                  <Box component="img" src={r.cover || "https://picsum.photos/800/400?blur=2"} alt={r.title} sx={{ width: "100%", height: 180, objectFit: "cover" }} />
                  <Box sx={{ p: 2 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>{r.title}</Typography>
                    <Typography variant="caption" color="text.secondary">{r.type} • {r.location}</Typography>
                    <Box sx={{ display: "flex", gap: 1, mt: 2 }}>
                      <Button size="small" variant="outlined" onClick={() => window.location.href = `/projects/${r.id}`}>View Project</Button>
                      <Button size="small" variant="contained" onClick={() => window.location.href = `/projects/${r.id}#support`}>Support Project</Button>
                    </Box>
                  </Box>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Quick Actions */}
        <Box sx={{ mt: 6 }}>
          <Typography variant="h6" sx={{ fontWeight: 800, mb: 2 }}>Quick Actions</Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={3}>
              <Paper sx={{ p: 2, borderRadius: 3 }}>
                <Typography sx={{ fontWeight: 800 }}>Browse Projects</Typography>
                <Typography variant="caption" color="text.secondary">Find initiatives to support</Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Paper sx={{ p: 2, borderRadius: 3 }}>
                <Typography sx={{ fontWeight: 800 }}>Track My Support</Typography>
                <Typography variant="caption" color="text.secondary">Monitor your contributions</Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Paper sx={{ p: 2, borderRadius: 3 }}>
                <Typography sx={{ fontWeight: 800 }}>View Updates</Typography>
                <Typography variant="caption" color="text.secondary">See recent progress</Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Paper sx={{ p: 2, borderRadius: 3 }}>
                <Typography sx={{ fontWeight: 800 }}>Profile Settings</Typography>
                <Typography variant="caption" color="text.secondary">Manage account</Typography>
              </Paper>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Box>
  );
}