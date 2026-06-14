import React from "react";
import { Card, CardMedia, CardContent, Typography, Box } from "@mui/material";

export default function UpdateCard({ update = {} }) {
  return (
    <Card sx={{ display: "flex", gap: 2, borderRadius: 3, boxShadow: "0 8px 24px rgba(17,24,39,0.06)" }}>
      <CardMedia component="img" image={update.photo || "https://picsum.photos/200/140?blur=2"} sx={{ width: 140, height: 100, objectFit: "cover", borderRadius: 2 }} />
      <CardContent sx={{ flex: 1 }}>
        <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>{update.project_title || "Project"}</Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>{update.message || "Update message"}</Typography>
        <Box sx={{ mt: 1 }}>
          <Typography variant="caption" color="text.secondary">{update.date || "Unknown date"}</Typography>
        </Box>
      </CardContent>
    </Card>
  );
}