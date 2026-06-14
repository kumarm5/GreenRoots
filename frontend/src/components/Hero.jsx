import React from "react";
import { Box, Container, Grid, Typography, Button, Paper } from "@mui/material";

export default function Hero() {
  return (
    <Box component="section" sx={{ py: { xs: 6, md: 10 }, bgcolor: "background.default" }}>
      <Container maxWidth="lg">
        <Grid container spacing={4} alignItems="center">
          <Grid item xs={12} md={6}>
            <Box>
              <Typography variant="h3" component="h1" sx={{ fontWeight: 800, mb: 2, color: "text.primary" }}>
                Grow Trees. Grow Communities.
              </Typography>
              <Typography variant="h6" sx={{ mb: 3, color: "text.secondary" }}>
                Supporting real plantation projects and creating lasting environmental impact.
              </Typography>
              <Typography sx={{ mb: 3 }}>
                Connect with passionate planters, support meaningful plantation projects, and follow the journey from sapling to thriving green spaces.
              </Typography>
              <Box display="flex" gap={2} flexWrap="wrap">
                <Button variant="contained" color="primary" size="large">
                  Join GreenRoots
                </Button>
                <Button variant="outlined" color="primary" size="large">
                  Explore Projects
                </Button>
              </Box>
            </Box>

            <Paper elevation={1} sx={{ mt: 4, p: 2, borderRadius: 2, display: { xs: "none", md: "block" } }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                Featured impact
              </Typography>
              <Typography variant="body2">50+ projects active · 12k trees planted · community-driven progress</Typography>
            </Paper>
          </Grid>

          <Grid item xs={12} md={6}>
            <Box
              sx={{
                width: "100%",
                borderRadius: 3,
                overflow: "hidden",
                boxShadow: "0 12px 30px rgba(14,30,15,0.12)",
              }}
            >
              <img
                alt="Plantation scene"
                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1400&auto=format&fit=crop"
                style={{ width: "100%", height: "100%", display: "block", objectFit: "cover", maxHeight: 460 }}
              />
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}