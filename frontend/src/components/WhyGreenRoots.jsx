import React from "react";
import { Box, Grid, Card, CardContent, Typography } from "@mui/material";
import PublicIcon from "@mui/icons-material/Public";
import PeopleIcon from "@mui/icons-material/People";
import NatureIcon from "@mui/icons-material/Nature";
import HourglassTopIcon from "@mui/icons-material/HourglassTop";

const benefits = [
  { title: "Transparent Impact", desc: "Track every project through updates and photos.", icon: <PublicIcon fontSize="large" color="primary" /> },
  { title: "Community Driven", desc: "Support people creating greener environments.", icon: <PeopleIcon fontSize="large" color="primary" /> },
  { title: "Real Projects", desc: "Connect with actual plantation initiatives.", icon: <NatureIcon fontSize="large" color="primary" /> },
  { title: "Long-Term Growth", desc: "Follow projects from planting to maturity.", icon: <HourglassTopIcon fontSize="large" color="primary" /> },
];

export default function WhyGreenRoots() {
  return (
    <Box component="section" sx={{ py: { xs: 4, md: 8 } }}>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: 800, textAlign: "center" }}>
        Why GreenRoots
      </Typography>

      <Grid container spacing={3}>
        {benefits.map((b) => (
          <Grid item xs={12} md={6} key={b.title}>
            <Card>
              <CardContent sx={{ display: "flex", gap: 2, alignItems: "center" }}>
                <Box sx={{ width: 64, height: 64, borderRadius: 2, bgcolor: "secondary.main", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  {b.icon}
                </Box>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>
                    {b.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {b.desc}
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