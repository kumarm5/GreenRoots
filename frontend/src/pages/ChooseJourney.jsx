import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Container,
  Grid,
  Typography,
  Button,
  useMediaQuery,
  useTheme,
  Card,
  CardContent,
} from "@mui/material";
import RoleCard from "../components/RoleCard";

export default function ChooseJourney() {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMdUp = useMediaQuery(theme.breakpoints.up("md"));

  const goToRegister = (role) => {
    navigate("/auth", { state: { role } });
  };

  // fallback / alternate images
  const HERO_IMG = "https://images.unsplash.com/photo-1501004318641-b39e6451bec6?q=80&w=1400&auto=format&fit=crop";
  const SUPPORTER_IMG = "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?q=80&w=1200&auto=format&fit=crop"; // already used, kept
  const PLANTER_IMG = "https://images.unsplash.com/photo-1506784970683-9c4a2f3f6b1b?q=80&w=1200&auto=format&fit=crop";

  return (
    <Box component="main" sx={{ bgcolor: "background.default", pb: 8 }}>
      <Box sx={{ py: 4, borderBottom: `1px solid rgba(0,0,0,0.04)`, bgcolor: "background.paper" }}>
        <Container maxWidth="lg" sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Typography variant="h6" sx={{ fontWeight: 800, color: "text.primary" }}>
            GreenRoots
          </Typography>
          <Box sx={{ display: "flex", gap: 2 }}>
            <Button variant="text" onClick={() => navigate("/")}>
              Back to Home
            </Button>
          </Box>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ pt: { xs: 6, md: 10 } }}>
        <Grid container spacing={4} alignItems="center">
          <Grid item xs={12} md={6}>
            <Typography variant="h3" sx={{ fontWeight: 900, color: "text.primary", mb: 2 }}>
              How Would You Like to Participate?
            </Typography>
            <Typography variant="h6" color="text.secondary" sx={{ mb: 3 }}>
              Supporting and growing plantation projects together.
            </Typography>
            <Typography sx={{ mb: 3 }}>
              Join GreenRoots as a supporter helping plantation projects thrive, or as a planter creating real environmental impact.
            </Typography>

            <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", mt: 2 }}>
              <Button variant="contained" color="primary" onClick={() => goToRegister("SUPPORTER")}>
                Continue as Supporter
              </Button>
              <Button variant="outlined" color="primary" onClick={() => goToRegister("PLANTER")}>
                Continue as Planter
              </Button>
            </Box>
          </Grid>

          <Grid item xs={12} md={6}>
            <Box sx={{ width: "100%", borderRadius: 3, overflow: "hidden", boxShadow: "0 10px 30px rgba(14,30,15,0.08)" }}>
              <img
                src={HERO_IMG}
                alt="Planting illustration"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = "https://picsum.photos/1400/800?blur=2";
                }}
                style={{ width: "100%", height: isMdUp ? 360 : 220, objectFit: "cover", display: "block" }}
              />
            </Box>
          </Grid>
        </Grid>

        <Box component="section" sx={{ mt: 6 }}>
          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <RoleCard
                title="Become a Supporter"
                subtitle="Discover projects, support needs and track impact."
                img={SUPPORTER_IMG}
                features={[
                  "Browse plantation projects",
                  "Support resource needs",
                  "Track project progress",
                  "Receive project updates",
                ]}
                role="SUPPORTER"
                onContinue={goToRegister}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <RoleCard
                title="Become a Planter"
                subtitle="Create projects, request resources, and share progress."
                img={PLANTER_IMG}
                features={[
                  "Create plantation projects",
                  "Request resources",
                  "Share progress updates",
                  "Build environmental impact",
                ]}
                role="PLANTER"
                onContinue={goToRegister}
              />
            </Grid>
          </Grid>
        </Box>

        <Box component="section" sx={{ mt: 8 }}>
          <Typography variant="h5" sx={{ fontWeight: 800, mb: 3, textAlign: "center" }}>
            One Platform. Shared Impact.
          </Typography>

          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <Card sx={{ borderRadius: 3 }}>
                <CardContent>
                  <Typography variant="h6" sx={{ fontWeight: 800 }}>
                    Transparent
                  </Typography>
                  <Typography color="text.secondary">Track support and project progress through updates and photos.</Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={4}>
              <Card sx={{ borderRadius: 3 }}>
                <CardContent>
                  <Typography variant="h6" sx={{ fontWeight: 800 }}>
                    Community Driven
                  </Typography>
                  <Typography color="text.secondary">Connect supporters and planters working toward a greener future.</Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={4}>
              <Card sx={{ borderRadius: 3 }}>
                <CardContent>
                  <Typography variant="h6" sx={{ fontWeight: 800 }}>
                    Real Impact
                  </Typography>
                  <Typography color="text.secondary">Support actual plantation efforts across farms, schools, parks and communities.</Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>

        <Box component="section" sx={{ mt: 8 }}>
          <Box sx={{ bgcolor: "linear-gradient(180deg, rgba(235,249,235,1) 0%, rgba(245,255,245,1) 100%)", borderRadius: 3, p: { xs: 3, md: 6 } }}>
            <Grid container alignItems="center" spacing={2}>
              <Grid item xs={12} md={8}>
                <Typography variant="h4" sx={{ fontWeight: 900 }}>
                  Every Tree Starts With Someone Taking the First Step.
                </Typography>
                <Typography color="text.secondary" sx={{ mt: 1 }}>
                  Join GreenRoots today and choose your way to make a lasting difference.
                </Typography>
              </Grid>
              <Grid item xs={12} md={4} sx={{ display: "flex", gap: 2, justifyContent: { xs: "flex-start", md: "flex-end" } }}>
                <Button variant="contained" color="primary" onClick={() => goToRegister("SUPPORTER")}>
                  Continue as Supporter
                </Button>
                <Button variant="outlined" color="primary" onClick={() => goToRegister("PLANTER")}>
                  Continue as Planter
                </Button>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}