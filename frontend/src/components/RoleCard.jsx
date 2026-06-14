import React from "react";
import PropTypes from "prop-types";
import {
  Card,
  CardActionArea,
  CardContent,
  Box,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Button,
  useTheme,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

export default function RoleCard({ title, subtitle, img, features, onContinue, role, elevation = 1 }) {
  const theme = useTheme();
  return (
    <Card elevation={elevation} sx={{ borderRadius: 3, transition: "transform .28s ease, box-shadow .28s ease", "&:hover": { transform: "translateY(-6px)" } }}>
      <CardActionArea onClick={() => onContinue(role)}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
          <Box sx={{ width: "100%", height: 220, overflow: "hidden", borderTopLeftRadius: 12, borderTopRightRadius: 12 }}>
            <img src={img} alt={title} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
          </Box>
          <CardContent>
            <Typography variant="h6" sx={{ fontWeight: 800, mb: 0.5 }}>
              {title}
            </Typography>
            {subtitle && (
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                {subtitle}
              </Typography>
            )}

            <List dense disablePadding>
              {features.map((f) => (
                <ListItem key={f} sx={{ py: 0.5 }}>
                  <ListItemIcon sx={{ minWidth: 36 }}>
                    <CheckCircleIcon sx={{ color: theme.palette.primary.main }} fontSize="small" />
                  </ListItemIcon>
                  <ListItemText primary={<Typography variant="body2">{f}</Typography>} />
                </ListItem>
              ))}
            </List>

            <Box sx={{ mt: 2, display: "flex", justifyContent: "flex-end" }}>
              <Button variant="contained" color="primary" onClick={(e) => { e.stopPropagation(); onContinue(role); }}>
                {role === "SUPPORTER" ? "Continue as Supporter" : "Continue as Planter"}
              </Button>
            </Box>
          </CardContent>
        </Box>
      </CardActionArea>
    </Card>
  );
}

RoleCard.propTypes = {
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string,
  img: PropTypes.string,
  features: PropTypes.array.isRequired,
  onContinue: PropTypes.func.isRequired,
  role: PropTypes.string.isRequired,
  elevation: PropTypes.number,
};