import React from "react";
import { Card, CardContent, Typography, Box } from "@mui/material";
import NaturePeopleIcon from "@mui/icons-material/NaturePeople";

export default function MetricsCard({ icon, value, label, sx = {} }) {
  return (
    <Card sx={{ borderRadius: 3, p: 1, boxShadow: "0 8px 28px rgba(17,24,39,0.06)", ...sx }}>
      <CardContent>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Box sx={{ bgcolor: "primary.light", color: "primary.dark", p: 1.5, borderRadius: 2 }}>
            {icon || <NaturePeopleIcon />}
          </Box>
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 800 }}>{value}</Typography>
            <Typography variant="body2" color="text.secondary">{label}</Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}