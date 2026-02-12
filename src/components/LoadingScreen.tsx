"use client"
import React from "react";
import { Box, CircularProgress } from "@mui/material";
import styled from "styled-components";

const LoaderContainer = styled(Box)`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #0b0f33 0%, #1a1f4d 50%, #0b0f33 100%);
  position: relative;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: radial-gradient(circle at 20% 50%, rgba(0, 194, 255, 0.05) 0%, transparent 50%),
                radial-gradient(circle at 80% 80%, rgba(0, 76, 0, 0.05) 0%, transparent 50%);
    pointer-events: none;
  }
`;

const LoaderContent = styled(Box)`
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
`;

const LoaderText = styled(Box)`
  font-size: 16px;
  font-weight: 600;
  color: #00C2FF;
  letter-spacing: 2px;
  animation: pulse 1.5s ease-in-out infinite;

  @keyframes pulse {
    0%, 100% {
      opacity: 0.6;
    }
    50% {
      opacity: 1;
    }
  }
`;

export default function LoadingScreen() {
  return (
    <LoaderContainer>
      <LoaderContent>
        <CircularProgress
          size={60}
          sx={{
            color: "#00C2FF",
            "& .MuiCircularProgress-circle": {
              strokeLinecap: "round",
            },
          }}
        />
        <LoaderText>Loading Dashboard...</LoaderText>
      </LoaderContent>
    </LoaderContainer>
  );
}
