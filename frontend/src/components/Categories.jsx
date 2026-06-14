import React from "react";
import { Box, Grid, Card, CardActionArea, CardMedia, CardContent, Typography } from "@mui/material";

const categories = [
  { title: "Farm Plantation", img: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1200&auto=format&fit=crop", desc: "Large-scale farm planting projects." },
  { title: "Community Plantation", img: "https://images.unsplash.com/photo-1506784970683-9c4a2f3f6b1b?q=80&w=1200&auto=format&fit=crop", desc: "Neighborhoods and community-driven green projects." },
  { title: "School Plantation", img: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=1200&auto=format&fit=crop", desc: "Educational initiatives engaging students." },
  { title: "Roadside Plantation", img: "https://images.unsplash.com/photo-1470506028280-2e0a0b7b6a7b?q=80&w=1200&auto=format&fit=crop", desc: "Beautify roads and corridors with greenery." },
  { title: "Park Plantation", img: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?q=80&w=1200&auto=format&fit=crop", desc: "Urban park and public space projects." },
];

export default function Categories() {
  return (
    <Box component="section" sx={{ py: { xs: 4, md: 8 } }}>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: 800, textAlign: "center" }}>
        Plantation Categories
      </Typography>

      <Grid container spacing={3}>
        {categories.map((c) => (
          <Grid item xs={12} sm={6} md={4} lg={2} key={c.title}>
            <CardActionArea component="div">
              <Card sx={{ borderRadius: 3 }}>
                <CardMedia component="img" height="140" image={c.img} alt={c.title} />
                <CardContent>
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>
                    {c.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {c.desc}
                  </Typography>
                </CardContent>
              </Card>
            </CardActionArea>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}