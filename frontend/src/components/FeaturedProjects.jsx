import React from "react";
import { Box, Grid, Card, CardMedia, CardContent, Typography, LinearProgress, Chip, Button } from "@mui/material";

const sampleProjects = [
  {
    id: 1,
    title: "Riverbank Reforest",
    location: "Riverside Village",
    type: "Community",
    target: 500,
    planted: 210,
    img: "https://images.unsplash.com/photo-1501004318641-b39e6451bec6?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: 2,
    title: "School Shade Trees",
    location: "Green Valley School",
    type: "School",
    target: 120,
    planted: 60,
    img: "https://images.unsplash.com/photo-1501009771991-9a1b83da78b1?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: 3,
    title: "Highway Greening",
    location: "Route 9",
    type: "Roadside",
    target: 1000,
    planted: 420,
    img: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=1200&auto=format&fit=crop",
  },
];

export default function FeaturedProjects() {
  return (
    <Box component="section" sx={{ py: { xs: 4, md: 8 } }}>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: 800, textAlign: "center" }}>
        Featured Projects
      </Typography>

      <Grid container spacing={3}>
        {sampleProjects.map((p) => {
          const progress = Math.round((p.planted / p.target) * 100);
          return (
            <Grid item xs={12} md={4} key={p.id}>
              <Card>
                <CardMedia component="img" height="200" image={p.img} alt={p.title} />
                <CardContent>
                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Box>
                      <Typography variant="h6" sx={{ fontWeight: 700 }}>
                        {p.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {p.location} • {p.type}
                      </Typography>
                    </Box>
                    <Chip label={`${p.planted}/${p.target}`} color="secondary" />
                  </Box>

                  <Box sx={{ mt: 2 }}>
                    <LinearProgress variant="determinate" value={progress} sx={{ height: 10, borderRadius: 5 }} />
                    <Typography variant="caption" color="text.secondary">
                      {progress}% funded
                    </Typography>
                  </Box>

                  <Box display="flex" justifyContent="flex-end" sx={{ mt: 2 }}>
                    <Button variant="outlined">View Project</Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
}