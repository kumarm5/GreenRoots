import React, { useState, useEffect } from "react";
import {
  Box,
  Grid,
  Paper,
  Tabs,
  Tab,
  Typography,
  TextField,
  Button,
  Checkbox,
  FormControlLabel,
  Link,
  Avatar,
  Alert,
  CircularProgress,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useNavigate, useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import axios from "axios";

/**
 * AuthPage — updated to follow GreenRoots Design System
 * - Max width 1280px
 * - Border radius 20px, soft shadows, subtle animations
 * - Primary Green: #2F855A, Dark Green: #22543D, Light Green background: #E6FFFA
 * - Responsive split layout, role-aware content, login/register tabs
 */

const COLORS = {
  primary: "#2F855A",
  darkGreen: "#22543D",
  lightGreen: "#E6FFFA",
  bg: "#F8FAF8",
  card: "#FFFFFF",
  textPrimary: "#1A202C",
  textSecondary: "#4A5568",
};

function RoleHeader({ role }) {
  const isPlanter = role === "PLANTER";
  return (
    <Box sx={{ textAlign: "left", mb: 2 }}>
      <Typography variant="h4" sx={{ fontWeight: 900, color: COLORS.textPrimary, lineHeight: 1.05 }}>
        Join as a {isPlanter ? "Planter" : "Supporter"}
      </Typography>
      <Typography color={COLORS.textSecondary} sx={{ mt: 1 }}>
        {isPlanter
          ? "Create plantation projects, request resources, and share your impact with the community."
          : "Help plantation projects thrive by supporting resources and tracking real-world impact."}
      </Typography>
    </Box>
  );
}

export default function AuthPage() {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const incomingRole = (location.state && location.state.role) || null;
  const [role, setRole] = useState(incomingRole === "PLANTER" ? "PLANTER" : incomingRole === "SUPPORTER" ? "SUPPORTER" : null);

  const [tab, setTab] = useState(incomingRole ? 1 : 0); // if role passed, prefer Register
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);

  // Login form
  const {
    register: registerLogin,
    handleSubmit: handleSubmitLogin,
    formState: { errors: loginErrors },
  } = useForm();

  // Register form
  const {
    register: registerReg,
    handleSubmit: handleSubmitReg,
    watch: watchReg,
    reset: resetReg,
    formState: { errors: regErrors },
  } = useForm({
    defaultValues: { role: role || "", first_name: "", last_name: "", email: "", phone_number: "", password: "", confirm_password: "", terms: false },
  });

  const passwordValue = watchReg("password");

  useEffect(() => {
    // If navigation included role, show register tab by default
    if (incomingRole) {
      setTab(1);
      setRole(incomingRole === "PLANTER" ? "PLANTER" : "SUPPORTER");
    }
  }, [incomingRole]);

  const saveToken = (token) => {
    localStorage.setItem("token", token);
    axios.defaults.headers.common["Authorization"] = `Token ${token}`;
  };

  async function onLogin(data) {
    setServerError("");
    setLoading(true);
    try {
      const res = await axios.post("http://localhost:8000/api/accounts/login/", {
        email: data.email,
        password: data.password,
      });
      if (res.data && res.data.token) {
        saveToken(res.data.token);
        // Prefer server-provided role, fallback to selected role, then SUPPORTER
        const userRole = (res.data.user && res.data.user.role) || role || "SUPPORTER";
        if (userRole === "PLANTER") {
          navigate("/planter-dashboard");
        } else {
          navigate("/supporter-dashboard");
        }
      } else {
        setServerError("Unexpected response from server.");
      }
    } catch (err) {
      setServerError(err.response?.data?.detail || err.response?.data?.error || "Login failed. Check credentials.");
    } finally {
      setLoading(false);
    }
  }

  async function onRegister(data) {
    setServerError("");
    setLoading(true);
    try {
      const payload = {
        email: data.email,
        username: data.email.split("@")[0],
        first_name: data.first_name,
        last_name: data.last_name,
        phone_number: data.phone_number,
        role: role || "SUPPORTER",
        password: data.password,
      };
      const res = await axios.post("/api/accounts/register/", payload);
      if (res.data && res.data.token) {
        saveToken(res.data.token);
        if (payload.role === "PLANTER") {
          navigate("/planter-profile-setup", { replace: true });
        } else {
          navigate("/supporter-dashboard", { replace: true });
        }
      } else {
        setServerError("Unexpected response from server.");
      }
    } catch (err) {
      setServerError(err.response?.data?.detail || Object.values(err.response?.data || {}).flat().join(" ") || "Registration failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Box sx={{ minHeight: "100vh", display: "flex", alignItems: "center", bgcolor: COLORS.bg, py: { xs: 6, md: 12 } }}>
      <Box sx={{ width: "100%", maxWidth: 1280, mx: "auto", px: 3 }}>
        <Grid container spacing={6} alignItems="center">
          {/* Left illustration + role content */}
          <Grid item xs={12} md={6}>
            <Paper
              elevation={2}
              sx={{
                borderRadius: "20px",
                overflow: "hidden",
                bgcolor: COLORS.card,
                boxShadow: "0 10px 30px rgba(17,24,39,0.06)",
                animation: "fadeIn .6s ease forwards",
                "@keyframes fadeIn": {
                  "0%": { opacity: 0, transform: "translateY(10px)" },
                  "100%": { opacity: 1, transform: "translateY(0)" },
                },
              }}
            >
              <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
                <Box sx={{ position: "relative", height: { xs: 220, md: 380 }, overflow: "hidden" }}>
                  <img
                    alt="role illustration"
                    src={
                      role === "PLANTER"
                        ? "https://images.unsplash.com/photo-1501004318641-b39e6451bec6?q=80&w=1400&auto=format&fit=crop"
                        : "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?q=80&w=1400&auto=format&fit=crop"
                    }
                    onError={(e) => {
                      e.currentTarget.src = "https://picsum.photos/1400/800?blur=2";
                    }}
                    style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", transition: "transform .4s ease" }}
                  />
                </Box>

                <Box sx={{ p: { xs: 3, md: 5 } }}>
                  <RoleHeader role={role || "SUPPORTER"} />
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="subtitle1" color={COLORS.textSecondary} sx={{ mb: 2 }}>
                      Why join?
                    </Typography>
                    <Box component="ul" sx={{ pl: 2, color: COLORS.textPrimary, "& li": { mb: 1 } }}>
                      {role === "PLANTER" ? (
                        <>
                          <li>Create and manage your plantation projects</li>
                          <li>Request resources and receive support</li>
                          <li>Share updates and grow local impact</li>
                        </>
                      ) : (
                        <>
                          <li>Discover real plantation projects</li>
                          <li>Support resource needs and see outcomes</li>
                          <li>Track contributions with project updates</li>
                        </>
                      )}
                    </Box>
                  </Box>
                </Box>
              </Box>
            </Paper>
          </Grid>

          {/* Right auth card */}
          <Grid item xs={12} md={6}>
            <Paper
              elevation={8}
              sx={{
                borderRadius: "20px",
                p: { xs: 3, md: 5 },
                bgcolor: COLORS.card,
                boxShadow: "0 14px 40px rgba(17,24,39,0.08)",
                animation: "fadeIn .6s ease .08s forwards",
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
                <Avatar sx={{ bgcolor: COLORS.darkGreen, width: 48, height: 48, fontWeight: 800 }}>GR</Avatar>
                <Typography variant="h6" sx={{ fontWeight: 800, color: COLORS.textPrimary }}>
                  {role === "PLANTER" ? "Planter Portal" : role === "SUPPORTER" ? "Supporter Portal" : "Sign In / Create Account"}
                </Typography>
              </Box>

              {/* Role selector when role not preselected */}
              <Box sx={{ mb: 2 }}>
                <ToggleButtonGroup
                  value={role}
                  exclusive
                  onChange={(e, value) => {
                    if (value) setRole(value);
                  }}
                  aria-label="role selection"
                  sx={{
                    "& .MuiToggleButton-root": {
                      borderRadius: 12,
                      textTransform: "none",
                      border: "1px solid rgba(17,24,39,0.06)",
                      color: COLORS.textPrimary,
                    },
                    "& .MuiToggleButton-root.Mui-selected": {
                      backgroundColor: COLORS.lightGreen,
                      borderColor: COLORS.primary,
                      color: COLORS.darkGreen,
                    },
                  }}
                >
                  <ToggleButton value="SUPPORTER" aria-label="supporter">
                    Supporter
                  </ToggleButton>
                  <ToggleButton value="PLANTER" aria-label="planter">
                    Planter
                  </ToggleButton>
                </ToggleButtonGroup>
              </Box>

              <Tabs value={tab} onChange={(e, v) => { setTab(v); setServerError(""); }} textColor="primary" indicatorColor="primary">
                <Tab label="Login" />
                <Tab label="Register" />
              </Tabs>

              <Box sx={{ mt: 3 }}>
                {serverError && <Alert severity="error" sx={{ mb: 2 }}>{serverError}</Alert>}

                {tab === 0 ? (
                  // LOGIN FORM
                  <Box component="form" onSubmit={handleSubmitLogin(onLogin)} noValidate>
                    <TextField
                      label="Email"
                      fullWidth
                      margin="normal"
                      {...registerLogin("email", { required: "Email is required" })}
                      error={!!loginErrors.email}
                      helperText={loginErrors.email?.message}
                      sx={{ "& .MuiInputBase-root": { borderRadius: 12 } }}
                    />
                    <TextField
                      label="Password"
                      type="password"
                      fullWidth
                      margin="normal"
                      {...registerLogin("password", { required: "Password is required" })}
                      error={!!loginErrors.password}
                      helperText={loginErrors.password?.message}
                      sx={{ "& .MuiInputBase-root": { borderRadius: 12 } }}
                    />
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mt: 1 }}>
                      <FormControlLabel control={<Checkbox {...registerLogin("remember")} />} label="Remember Me" />
                      <Link component="button" variant="body2" onClick={() => alert("Forgot password flow not implemented in demo.")}>
                        Forgot Password?
                      </Link>
                    </Box>

                    <Box sx={{ mt: 3, display: "flex", gap: 2 }}>
                      <Button
                        type="submit"
                        variant="contained"
                        fullWidth
                        disabled={loading}
                        startIcon={loading ? <CircularProgress size={18} /> : null}
                        sx={{ borderRadius: 12, bgcolor: COLORS.primary }}
                      >
                        Sign In
                      </Button>
                    </Box>

                    <Box sx={{ mt: 2, textAlign: "center" }}>
                      <Button variant="text" onClick={() => setTab(1)} sx={{ textTransform: "none" }}>
                        Create Account
                      </Button>
                    </Box>
                  </Box>
                ) : (
                  // REGISTER FORM
                  <Box component="form" onSubmit={handleSubmitReg(onRegister)} noValidate>
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          label="First Name"
                          fullWidth
                          {...registerReg("first_name", { required: "First name is required" })}
                          error={!!regErrors.first_name}
                          helperText={regErrors.first_name?.message}
                          sx={{ "& .MuiInputBase-root": { borderRadius: 12 } }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          label="Last Name"
                          fullWidth
                          {...registerReg("last_name", { required: "Last name is required" })}
                          error={!!regErrors.last_name}
                          helperText={regErrors.last_name?.message}
                          sx={{ "& .MuiInputBase-root": { borderRadius: 12 } }}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          label="Email"
                          fullWidth
                          {...registerReg("email", {
                            required: "Email is required",
                            pattern: { value: /^\S+@\S+$/i, message: "Enter a valid email" },
                          })}
                          error={!!regErrors.email}
                          helperText={regErrors.email?.message}
                          sx={{ "& .MuiInputBase-root": { borderRadius: 12 } }}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          label="Phone Number"
                          fullWidth
                          {...registerReg("phone_number", {
                            required: false,
                            pattern: { value: /^\+?\d{7,15}$/, message: "Enter a valid phone number" },
                          })}
                          error={!!regErrors.phone_number}
                          helperText={regErrors.phone_number?.message}
                          sx={{ "& .MuiInputBase-root": { borderRadius: 12 } }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          label="Password"
                          type="password"
                          fullWidth
                          {...registerReg("password", { required: "Password is required", minLength: { value: 8, message: "Minimum 8 characters" } })}
                          error={!!regErrors.password}
                          helperText={regErrors.password?.message}
                          sx={{ "& .MuiInputBase-root": { borderRadius: 12 } }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          label="Confirm Password"
                          type="password"
                          fullWidth
                          {...registerReg("confirm_password", {
                            required: "Confirm your password",
                            validate: (v) => v === passwordValue || "Passwords do not match",
                          })}
                          error={!!regErrors.confirm_password}
                          helperText={regErrors.confirm_password?.message}
                          sx={{ "& .MuiInputBase-root": { borderRadius: 12 } }}
                        />
                      </Grid>

                      {/* hidden role field populated from selected role (fallback SUPPORTER) */}
                      <input type="hidden" value={role || "SUPPORTER"} {...registerReg("role")} />

                      <Grid item xs={12}>
                        <FormControlLabel
                          control={<Checkbox {...registerReg("terms", { required: "You must accept terms" })} />}
                          label={<Typography variant="body2">I agree to the Terms and Conditions</Typography>}
                        />
                        {regErrors.terms && <Typography color="error" variant="caption">{regErrors.terms.message}</Typography>}
                      </Grid>
                    </Grid>

                    <Box sx={{ mt: 3, display: "flex", gap: 2 }}>
                      <Button
                        type="submit"
                        variant="contained"
                        fullWidth
                        disabled={loading}
                        startIcon={loading ? <CircularProgress size={18} /> : null}
                        sx={{ borderRadius: 12, bgcolor: COLORS.primary }}
                      >
                        Create Account
                      </Button>
                    </Box>

                    <Box sx={{ mt: 2, textAlign: "center" }}>
                      <Button variant="text" onClick={() => setTab(0)} sx={{ textTransform: "none" }}>
                        Sign In
                      </Button>
                    </Box>
                  </Box>
                )}
              </Box>

              <Box sx={{ mt: 3, textAlign: "center" }}>
                <Link component="button" variant="body2" onClick={() => navigate("/")}>
                  Back to Home
                </Link>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}