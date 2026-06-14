import React from "react";
import { Card, CardMedia, CardContent, Typography, Box, Chip, LinearProgress, Button } from "@mui/material";

export default function SupporterProjectCard({ project = {}, onView, onUpdates }) {
  const progress = project.target && project.planted ? Math.round((project.planted / project.target) * 100) : 0;
  return (
    <Card sx={{ width: 320, borderRadius: 3, mr: 2, boxShadow: "0 10px 28px rgba(17,24,39,0.06)" }}>
      <CardMedia component="img" height="140" image={project.cover || "https://picsum.photos/600/360?blur=2"} />
      <CardContent>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: 2 }}>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 800 }}>{project.title || "Untitled Project"}</Typography>
            <Typography variant="caption" color="text.secondary">{project.type || "Community"} • {project.location || "Unknown"}</Typography>
          </Box>
          <Chip label={project.status || "Active"} color={project.status === "COMPLETED" ? "success" : "primary"} />
        </Box>

        <Box sx={{ mt: 2 }}>
          <LinearProgress variant="determinate" value={progress} sx={{ height: 10, borderRadius: 6 }} />
          <Box sx={{ display: "flex", justifyContent: "space-between", mt: 1 }}>
            <Typography variant="caption" color="text.secondary">{progress}%</Typography>
            <Typography variant="caption" color="text.secondary">{project.planted || 0}/{project.target || 0} trees</Typography>
          </Box>
        </Box>

        <Box sx={{ display: "flex", gap: 1, mt: 2 }}>
          <Button size="small" variant="outlined" onClick={() => onView && onView(project)}>View Project</Button>
          <Button size="small" variant="contained" onClick={() => onUpdates && onUpdates(project)}>Track Updates</Button>
        </Box>
      </CardContent>
    </Card>
  );
}