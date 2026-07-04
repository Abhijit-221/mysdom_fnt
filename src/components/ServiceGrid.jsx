import React from 'react';
import { ShieldCheck, ArrowRight, Trash2Icon } from "lucide-react";
import { Box, Paper, Typography, Avatar, IconButton } from '@mui/material';

// ── Brand-locked tokens ──
const INK = "#0B2B33";
const AMBER = "#F2A65A";
const LINE = "rgba(11,43,51,0.08)";
const MUTED = "#5C7178";

function ServiceGrid({ services, user, deleteService }) {
  console.log("services---", services);

  return (
    <Box
      sx={{
        display: "flex",
        flexWrap: "wrap",
        gap: 3,
      }}
    >
      {services.map((service, index) => (
        <Paper
          key={index}
          elevation={0}
          sx={{
            flex: {
              xs: "1 1 100%",
              sm: "1 1 calc(50% - 12px)",
              md: "1 1 calc(33.333% - 16px)",
            },
            display: "flex",
            flexDirection: "column",
            p: 3.5,
            borderRadius: "16px",
            border: `1px solid ${LINE}`,
            boxShadow: "0 16px 34px -24px rgba(11,43,51,0.25)",
            transition: "transform 0.3s ease, box-shadow 0.3s ease",
            "&:hover": {
              transform: "translateY(-5px)",
              boxShadow: "0 22px 42px -20px rgba(11,43,51,0.3)",
            },
          }}
        >
          <Avatar
            sx={{
              width: 52,
              height: 52,
              bgcolor: "rgba(242,166,90,0.15)",
              color: AMBER,
              mb: 2.5,
            }}
          >
            <ShieldCheck size={26} />
          </Avatar>

          <Typography sx={{ fontWeight: 700, fontSize: 18, color: INK, mb: 1.25 }}>
            {service.name}
          </Typography>

          <Typography sx={{ fontSize: 14.5, lineHeight: 1.75, color: MUTED, mb: user ? 3 : 0, flexGrow: 1 }}>
            {service.description}
          </Typography>

          {user && (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                pt: 2.5,
                borderTop: `1px solid ${LINE}`,
              }}
            >
              <Typography
                onClick={() => (window.location.href = `/service/detail/${service.id}`)}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 0.75,
                  fontSize: 14,
                  fontWeight: 600,
                  color: INK,
                  cursor: "pointer",
                }}
              >
                Learn More <ArrowRight size={16} />
              </Typography>
              <IconButton
                onClick={() => deleteService(service.id)}
                disableRipple
                sx={{
                  color: "#B3431E",
                  bgcolor: "rgba(179,67,30,0.08)",
                  borderRadius: "8px",
                  width: 34,
                  height: 34,
                  "&:hover": { bgcolor: "rgba(179,67,30,0.08)" },
                }}
              >
                <Trash2Icon size={17} />
              </IconButton>
            </Box>
          )}
        </Paper>
      ))}
    </Box>
  );
}

export default ServiceGrid;