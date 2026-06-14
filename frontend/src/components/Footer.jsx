import React from "react";
import { Box, Container, Grid, Typography, Link, IconButton } from "@mui/material";
import FacebookIcon from "@mui/icons-material/Facebook";
import TwitterIcon from "@mui/icons-material/Twitter";
import InstagramIcon from "@mui/icons-material/Instagram";

export default function Footer() {
  return (
    <Box component="footer" sx={{ bgcolor: "background.paper", py: 6, mt: 6 }}>
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          <Grid item xs={12} md={3}>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              GreenRoots
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Growing a greener future together.
            </Typography>
          </Grid>

          <Grid item xs={6} md={3}>
            <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
              Platform
            </Typography>
            <Box sx={{ mt: 1 }}>
              <Link display="block" href="#" color="inherit">Browse Projects</Link>
              <Link display="block" href="#" color="inherit">How It Works</Link>
              <Link display="block" href="#" color="inherit">Login</Link>
            </Box>
          </Grid>

          <Grid item xs={6} md={3}>
            <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
              Community
            </Typography>
            <Box sx={{ mt: 1 }}>
              <Link display="block" href="#" color="inherit">Supporters</Link>
              <Link display="block" href="#" color="inherit">Planters</Link>
            </Box>
          </Grid>

          <Grid item xs={12} md={3}>
            <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
              Company
            </Typography>
            <Box sx={{ mt: 1 }}>
              <Link display="block" href="#" color="inherit">About GreenRoots</Link>
              <Link display="block" href="#" color="inherit">Contact</Link>
            </Box>

            <Box sx={{ mt: 2 }}>
              <IconButton aria-label="facebook"><FacebookIcon /></IconButton>
              <IconButton aria-label="twitter"><TwitterIcon /></IconButton>
              <IconButton aria-label="instagram"><InstagramIcon /></IconButton>
            </Box>
          </Grid>
        </Grid>

        <Box sx={{ mt: 4, borderTop: "1px solid rgba(0,0,0,0.06)", pt: 3, textAlign: "center" }}>
          <Typography variant="body2" color="text.secondary">
            © GreenRoots. Growing a greener future together.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}