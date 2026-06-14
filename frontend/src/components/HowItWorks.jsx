import React from "react";
import { Box, Grid, Card, CardContent, Typography } from "@mui/material";
import FilterHdrIcon from "@mui/icons-material/FilterHdr";
import FavoriteIcon from "@mui/icons-material/Favorite";
import TimelineIcon from "@mui/icons-material/Timeline";

const steps = [
  {
    title: "Discover Projects",
    desc: "Browse plantation projects from farms, schools, communities, parks, and roadside initiatives.",
    icon: <FilterHdrIcon fontSize="large" color="primary" />,
  },
  {
    title: "Support Needs",
    desc: "Help projects by providing resources such as saplings, irrigation supplies, and tools.",
    icon: <FavoriteIcon fontSize="large" color="primary" />,
  },
  {
    title: "Track Impact",
    desc: "Receive updates, photos, and progress reports showing real-world impact.",
    icon: <TimelineIcon fontSize="large" color="primary" />,
  },
];

export default function HowItWorks() {
  return (
    <Box component="section" sx={{ py: { xs: 4, md: 8 } }}>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: 800, textAlign: "center" }}>
        How It Works
      </Typography>

      <Grid container spacing={3}>
        {steps.map((s, idx) => (
          <Grid item xs={12} md={4} key={s.title}>
            <Card>
              <CardContent sx={{ display: "flex", gap: 2, alignItems: "flex-start" }}>
                <Box sx={{ width: 64, height: 64, borderRadius: 2, bgcolor: "secondary.main", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  {s.icon}
                </Box>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>
                    {s.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {s.desc}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}