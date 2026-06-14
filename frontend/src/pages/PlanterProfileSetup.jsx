import React, { useState } from "react";
import {
  Box,
  Paper,
  Grid,
  TextField,
  Button,
  Avatar,
  Typography,
  CircularProgress,
  Alert,
} from "@mui/material";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useNavigate } from "react-router-dom";

/**
 * PlanterProfileSetup
 * - Simple profile setup form for newly-registered planters
 * - Upload profile photo, location, state, bio, story, years_of_experience
 * - On save: PATCH to /api/accounts/my-profile/ (assumes token auth header present)
 * - Redirect to /planter-dashboard on success
 */

export default function PlanterProfileSetup() {
  const navigate = useNavigate();
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [serverErr, setServerErr] = useState("");

  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: { location: "", state: "", bio: "", story: "", years_of_experience: "" },
  });

  const onFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  async function onSubmit(values) {
    setServerErr("");
    setLoading(true);
    try {
      // Build FormData for file upload
      const fd = new FormData();
      if (values.profile_photo?.[0]) fd.append("profile_photo", values.profile_photo[0]);
      fd.append("location", values.location);
      fd.append("state", values.state);
      fd.append("bio", values.bio);
      fd.append("story", values.story);
      fd.append("years_of_experience", values.years_of_experience || 0);

      // Replace with your real endpoint; using PATCH to my-profile
      const res = await axios.patch("/api/accounts/my-profile/", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      // success -> planter dashboard
      navigate("/planter-dashboard");
    } catch (err) {
      setServerErr(err.response?.data?.detail || "Failed to save profile.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Box sx={{ minHeight: "80vh", py: 8, bgcolor: "background.default", display: "flex", alignItems: "center" }}>
      <Box sx={{ width: "100%", maxWidth: 900, mx: "auto", px: 2 }}>
        <Paper elevation={6} sx={{ borderRadius: 3, p: { xs: 2, md: 4 } }}>
          <Typography variant="h5" sx={{ fontWeight: 900, mb: 2 }}>
            Finish Your Planter Profile
          </Typography>
          <Typography color="text.secondary" sx={{ mb: 3 }}>
            Help supporters learn about you and your projects.
          </Typography>

          {serverErr && <Alert severity="error" sx={{ mb: 2 }}>{serverErr}</Alert>}

          <Box component="form" onSubmit={handleSubmit(onSubmit)} encType="multipart/form-data">
            <Grid container spacing={2}>
              <Grid item xs={12} md={4}>
                <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
                  <Avatar src={avatarPreview || ""} sx={{ width: 120, height: 120 }} />
                  <Button variant="outlined" component="label">
                    Upload Photo
                    <input hidden accept="image/*" type="file" {...register("profile_photo")} onChange={onFileChange} />
                  </Button>
                </Box>
              </Grid>

              <Grid item xs={12} md={8}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField label="Location" fullWidth {...register("location", { required: "Location required" })} error={!!errors.location} helperText={errors.location?.message} />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField label="State" fullWidth {...register("state", { required: "State required" })} error={!!errors.state} helperText={errors.state?.message} />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField label="Bio" fullWidth multiline rows={3} {...register("bio")} />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField label="Story" fullWidth multiline rows={3} {...register("story")} />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField label="Years of Experience" type="number" fullWidth {...register("years_of_experience", { min: 0 })} />
                  </Grid>
                </Grid>
              </Grid>

              <Grid item xs={12} sx={{ display: "flex", gap: 2, justifyContent: "flex-end" }}>
                <Button variant="outlined" onClick={() => navigate("/")} disabled={loading}>Cancel</Button>
                <Button type="submit" variant="contained" disabled={loading} startIcon={loading ? <CircularProgress size={18} /> : null}>
                  Save Profile
                </Button>
              </Grid>
            </Grid>
          </Box>
        </Paper>
      </Box>
    </Box>
  );
}