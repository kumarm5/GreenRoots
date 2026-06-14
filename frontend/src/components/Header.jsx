import React from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import { Link } from "react-router-dom"; // added import

export default function Header() {
  return (
    <AppBar position="sticky" color="transparent" elevation={0} sx={{ backdropFilter: "blur(6px)" }}>
      <Toolbar sx={{ justifyContent: "space-between", py: 1 }}>
        <Box display="flex" alignItems="center" gap={2}>
          <Box
            sx={{
              width: 44,
              height: 44,
              borderRadius: 2,
              bgcolor: "primary.main",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              fontWeight: 700,
              boxShadow: "0 4px 12px rgba(46,125,50,0.18)",
            }}
          >
            GR
          </Box>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            GreenRoots
          </Typography>
        </Box>

        <Stack direction="row" spacing={2} alignItems="center" sx={{ display: { xs: "none", md: "flex" } }}>
          <Button color="inherit" component={Link} to="/">
            Home
          </Button>
          <Button color="inherit">How It Works</Button>
          <Button color="inherit" component={Link} to="/projects">
            Browse Projects
          </Button>
          <Button color="inherit">About</Button>
          <Button color="inherit" component={Link} to="/auth">
            Login
          </Button>
          <Button variant="contained" color="primary" component={Link} to="/choose">
            Join GreenRoots
          </Button>
        </Stack>
      </Toolbar>
    </AppBar>
  );
}