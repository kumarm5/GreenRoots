import React from "react";
import { Box, Container, Typography, Button, Grid } from "@mui/material";

export default function CTA() {
  return (
    <Box component="section" sx={{ py: { xs: 6, md: 10 }, bgcolor: "linear-gradient(180deg, rgba(235,249,235,1) 0%, rgba(245,255,245,1) 100%)", mt: 4 }}>
      <Container maxWidth="lg">
        <Grid container alignItems="center" spacing={4}>
          <Grid item xs={12} md={8}>
            <Typography variant="h4" sx={{ fontWeight: 800 }}>
              Ready to Make an Impact?
            </Typography>
            <Typography sx={{ mt: 1, color: "text.secondary" }}>
              Supporting a greener future starts with one project.
            </Typography>
          </Grid>
          <Grid item xs={12} md={4} sx={{ display: "flex", gap: 2, justifyContent: { xs: "flex-start", md: "flex-end" } }}>
            <Button variant="contained" color="primary">
              Join as Supporter
            </Button>
            <Button variant="outlined" color="primary">
              Create a Plantation Project
            </Button>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}